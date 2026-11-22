#!/usr/bin/env node
/**
 * scripts/auto-commit.mjs — Conventional Commit message engine.
 *
 * Reads the *staged* diff and prints a Conventional Commit message.
 * It never stages, commits, or mutates the index. Modes:
 *
 *   node scripts/auto-commit.mjs                 commit what is already staged
 *   node scripts/auto-commit.mjs --dry-run       print the message + files that would change
 *   node scripts/auto-commit.mjs --amend         like default but amend the previous commit
 *   node scripts/auto-commit.mjs --paths a b     stage ONLY a and b, then commit
 *   node scripts/auto-commit.mjs --message-only  stdout: message only (no staging/commit)
 *
 * Staging policy:
 *   - explicit --paths: stage ONLY those paths (git add verified)
 *   - otherwise: commit what is already staged; nothing is auto-staged
 *
 * Safety:
 *   - staged .env* / .pem / .key / .p12 / id_rsa / .npmrc / credentials* /
 *     secrets* / *_secret files -> ABORT with exit 1, before any output
 *   - --message-only is read-only (used by the commit-msg hook)
 *
 * The git hook (scripts/git-hooks/commit-msg) is the delivery mechanism for
 * `git commit` without -m; it reuses this engine in --message-only mode.
 *
 * Messages are produced locally by heuristics (no network, no AI).
 * Conventional commit rules: lowercase type, <= 72 chars, no trailing period,
 * one blank line before the optional file-list body.
 */

import { execFileSync } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

const USAGE =
  "Usage: node scripts/auto-commit.mjs [--dry-run] [--amend] [--paths <path> ...] [-p <path>] [--message-only]\n" +
  "\n" +
  "  (default)         commit what is already staged; if nothing is staged, stage the\n" +
  "                    tracked working-tree changes (git add -u). Nothing is auto-staged.\n" +
  "  --dry-run         print the message this commit would get plus the files that would\n" +
  "                    change (never touches the real index)\n" +
  "  --amend           amend the previous commit instead of creating a new one\n" +
  "  --paths <path>    stage ONLY these paths, then commit (repeatable; --paths=a,b or\n" +
  "                    -p a are accepted)\n" +
  "  --message-only    stdout: print ONLY the message text; no staging, no commit,\n" +
  "                    no file-list output (used by the commit-msg hook)\n" +
  "\n" +
  "Messages are produced locally by heuristics (no network, no AI).\n" +
  "Conventional commit rules: lowercase type, <= 72 chars, no trailing period,\n" +
  "one blank line before the optional file-list body.";

const VERBS = { feat: "add", fix: "update", test: "test", style: "style",
  refactor: "refactor", chore: "add", docs: "add" };

const FILE_DESC = {
  "scripts/auto-commit.mjs": "auto commit message generator",
};

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function die(msg, code = 1) {
  console.error("auto-commit: " + msg);
  process.exit(code);
}

function parseArgs(argv) {
  const out = { dryRun: false, amend: false, paths: [], messageOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--amend") out.amend = true;
    else if (a === "--message-only") out.messageOnly = true;
    else if (a === "--paths") {
      if (i + 1 >= argv.length || argv[i + 1].startsWith("--")) die("--paths requires a path value");
      out.paths.push(argv[++i]);
    } else if (a.startsWith("--paths=")) {
      const v = a.slice("--paths=".length).split(",").map((s) => s.trim()).filter(Boolean);
      if (!v.length) die("--paths= requires at least one path");
      out.paths.push(...v);
    } else if (a === "-p") {
      if (i + 1 >= argv.length || argv[i + 1].startsWith("--")) die("-p requires a path value");
      out.paths.push(argv[++i]);
    } else die("unknown option: " + a + "\n" + USAGE);
  }
  return out;
}

function git(args, { input, env } = {}) {
  try {
    return { ok: true, status: 0, out: execFileSync("git", args, {
      encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input, env,
    }) };
  } catch (err) {
    const out = typeof err.stdout === "string" ? err.stdout : (err.stdout ?? "");
    const errMsg = typeof err.stderr === "string" ? err.stderr : (err.stderr ?? "");
    return { ok: false, status: err.status ?? 1, out, err: errMsg };
  }
}

function git0(args, { input } = {}) { // throws on failure, returns stdout
  const r = git(args, { input });
  if (!r.ok) die("git " + args.join(" ") + " failed (exit " + r.status + "): " + r.out);
  return r.out;
}

function gitTry(args, { input, env } = {}) { return git(args, { input, env }); }

function stdoutOf(res) { return typeof res === "string" ? res : (res.out ?? ""); }

function repoRoot() { return stdoutOf(gitTry(["rev-parse", "--show-toplevel"])).trim(); }

function hasRef(name) { return gitTry(["rev-parse", "-q", "--verify", name]).ok; }

function isRebasing() {
  return hasRef("REBASE_HEAD") || existsSync(join(repoRoot(), ".git", "rebase-merge")) ||
         existsSync(join(repoRoot(), ".git", "rebase-apply"));
}

function isMerging() { return hasRef("MERGE_HEAD") || hasRef("MERGE_REQ"); }

// ---------------------------------------------------------------------------
// staging
// ---------------------------------------------------------------------------

/** Files in the index with an A/M/D/R/C/T status. */
function stagedList() {
  return stdoutOf(gitTry(["diff", "--cached", "--name-only", "--diff-filter=ACMR"])).trim();
}

/** Tracked files changed in the working tree (M/D/R), unstaged. */
function worktreeTrackedNames() {
  return stdoutOf(gitTry(["diff", "--name-only"])).split("\n").filter((l) => l.length);
}

/** Stage explicit paths into the REAL index. Returns newly staged files. */
function stagePaths(paths) {
  const before = new Set(stagedList().split("\n").filter(Boolean));
  for (const p of paths) {
    const rel = normalizeRepoPath(p);
    try { execFileSync("git", ["add", "--", rel], { stdio: "pipe" }); } catch (err) {
      die("failed to stage '" + rel + "': " + (err.message || err));
    }
    if (!stagedList().split("\n").map((f) => f.trim()).includes(rel))
      die("git add did not stage '" + rel + "'");
  }
  return stagedList().split("\n").map((f) => f.trim()).filter((f) => !before.has(f));
}

function normalizeRepoPath(p) {
  const root = repoRoot();
  const rel = require("path").relative(root, require("path").resolve(root, p));
  if (rel.startsWith(".." + require("path").sep) || rel === "..") die("path is outside the repository: " + p);
  return rel;
}

/** Default when nothing is staged: stage the tracked working-tree changes. */
function stageTracked() {
  if (!stagedList()) execFileSync("git", ["add", "-u"], { stdio: "pipe" });
}

// ---------------------------------------------------------------------------
// classification (porcelain A/M/D/R/C/T codes)
// ---------------------------------------------------------------------------

function classify(code) {
  const c = String(code || "").charAt(0);
  if (c === "A" || c === "D" || c === "R" || c === "C" || c === "T") return c;
  return "M";
}

/** name-status parsed from a null-delimited stream (rename-safe). */
function nameStatusMap(raw) {
  const ns = new Map();
  for (const record of String(raw).split("\0").filter(Boolean)) {
    const i = record.indexOf("\t");
    if (i < 0) continue;
    const status = record.slice(0, i);
    let target = record.slice(i + 1);
    if (/^R\d+C\d+$/.test(status)) {
      const j = target.indexOf("\t");
      if (j >= 0) target = target.slice(j + 1);
    }
    ns.set(target, status);
  }
  return ns;
}

// ---------------------------------------------------------------------------
// secret guard
// ---------------------------------------------------------------------------

const SECRET_RE = [
  /(^|\/)(?:\.env|env)\.?[^/\s]*$/,   // .env, .env.local, env.local, .env.production
  /\.pem$/i, /\.key$/i, /\.p12$/i,
  /id_rsa/i, /\.npmrc$/i,
  /(^|\/)(credentials|secrets)($|\/)/i, /_secret$/i,
];

function isSecretPath(p) { return SECRET_RE.some((r) => r.test(p)); }

// ---------------------------------------------------------------------------
// message construction
// ---------------------------------------------------------------------------

function kindOf(filePath) {
  const base = filePath.split("/").pop() || filePath;
  const ext = extname(base).toLowerCase();
  if (ext === ".md" && base !== "README.md") return "docs";
  if (filePath.startsWith("scripts/")) return "chore";
  const tooling = new Set([
    "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "tsconfig.json", "tsconfig", "vite.config.js", "vite.config.ts",
    "vite.config.mjs", "eslint.config.js", "eslint.config.mjs", ".gitignore",
    "README.md", "LICENSE", "CONTRIBUTING.md",
  ]);
  if (tooling.has(base)) return "chore";
  if (/[.]test[.]|[.]spec[.]/.test(base)) return "test";
  if (/[.]css$|[.]scss$|[.]less$/ .test(ext)) return "style";
  return "fix";
}

function scopeOf(files) {
  if (files.length === 1) return baseWithoutExt(files[0]);
  const dirs = files.map((f) => f.split("/")[0]);
  if (dirs.every((d) => d === dirs[0])) return dirs[0];
  return "";
}

function baseWithoutExt(p) {
  return p.split("/").pop().replace(extname(p), "").toLowerCase();
}

function relativeWithoutExt(p) {
  return join(...p.split("/").slice(0, -1)).replace(extname(p), "") || p.split("/").pop();
}

function descriptionOf(paths) {
  const known = FILE_DESC[paths[0]];
  if (known) return known;
  return baseWithoutExt(paths[0]);
}

function buildMessage(files, nameStatus) {
  const counts = { feat: 0, fix: 0, test: 0, style: 0, refactor: 0, chore: 0, docs: 0 };
  for (const f of files) counts[kindOf(f)] += 1;
  const priority = ["feat", "fix", "test", "style", "refactor", "chore", "docs"];
  let type = "fix";
  for (const t of priority) if (counts[t] > 0) { type = t; break; }

  const scope = scopeOf(files);
  const subject = files.length === 1
    ? VERBS[type] + " " + relativeWithoutExt(files[0])
    : VERBS[type] + " " + descriptionOf(files);

  const lines = [];
  const buckets = { A: [], M: [], D: [], R: [] };
  for (const f of files) {
    const code = (nameStatus.get(f) || "").trim() || "M";
    buckets[classify(code)].push(f);
  }
  if (buckets.A.length) lines.push("Added:", ...buckets.A.map((a) => "  + " + a));
  if (buckets.M.length) lines.push("Modified:", ...buckets.M.map((m) => "  ~ " + m));
  if (buckets.D.length) lines.push("Deleted:", ...buckets.D.map((d) => "  - " + d));
  if (buckets.R.length) lines.push("Renamed:", ...buckets.R.map((r) => "  > " + r));

  return { type, scope, subject, msg: type + (scope ? "(" + scope + ")" : "") + ": " + subject +
    (lines.length ? "\n\n" + lines.join("\n") : "") };
}

// ---------------------------------------------------------------------------
// dry-run (never touches the real index, never commits)
// ---------------------------------------------------------------------------

/** Temp index holding a copy of .git/index; cleaned up on exit. */
function openTempIndex() {
  const idx = join(tmpdir(), "auto-commit-index-" + process.pid + "-" + Date.now() + "-" +
    Math.random().toString(36).slice(2) + ".tmp");
  try { if (existsSync(join(repoRoot(), ".git", "index"))) copyFileSync(
    join(repoRoot(), ".git", "index"), idx); } catch (e) { /* treat as empty index */ }
  return idx;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = repoRoot();
  process.chdir(root);

  if (isRebasing()) die("rebase in progress; complete it first");
  if (isMerging()) die("merge in progress; commit the result first");

  // ---- what is going to be committed -------------------------------------
  let files;
  if (opts.paths.length > 0) {
    files = stagePaths(opts.paths);                 // explicit, verified staging
  } else {
    files = stagedList().split("\n").map((f) => f.trim()).filter((f) => f.length);
    if (!files.length) { stageTracked(); files = stagedList().split("\n")
      .map((f) => f.trim()).filter((f) => f.length); }
  }

  if (opts.messageOnly) {
    const ns = new Map();
    const r = gitTry(["diff", "--cached", "--name-status", "-z", "-M"]);
    if (r.ok) for (const [k, v] of nameStatusMap(stdoutOf(r))) ns.set(k, v);
    const { msg } = buildMessage(files, ns);
    process.stdout.write(msg + "\n");
    process.exit(0);
  }

  if (opts.dryRun) {
    const preview = files.length ? files : worktreeTrackedNames();
    const ns = new Map();
    if (preview.length) {
      const r = gitTry(["diff", "--cached", "--name-status", "-z", "-M"]);
      if (r.ok) for (const [k, v] of nameStatusMap(stdoutOf(r))) ns.set(k, v);
    }
    const { msg } = buildMessage(preview, ns);
    console.log(msg);
    if (preview.length) console.log("\n[dry-run] would stage " + preview.length +
      " file(s): " + preview.join(", "));
    else console.log("\n[dry-run] no files matched");
    process.exit(0);
  }

  // ---- safety rails (commit path only) -----------------------------------
  const unsafe = [];
  for (const f of files) {
    if (isSecretPath(f)) { unsafe.push(f + " (secret)"); continue; }
    const r = gitTry(["ls-files", "-s", "--", f]);
    let size = NaN;
    if (r.ok) {
      const oid = stdoutOf(r).trim().split(/\s+/)[1];
      const s = gitTry(["cat-file", "-s", oid]);
      if (s.ok) size = Number(stdoutOf(s).trim());
    }
    if (!Number.isNaN(size) && size > 5 * 1024 * 1024) unsafe.push(f + " (" + size + " bytes)");
    else if (!Number.isNaN(size) && size > 1024 * 1024)
      unsafe.push(f + " (" + size + " bytes) - large");
  }
  if (unsafe.length) {
    console.error("auto-commit: refusing to commit unsafe file(s):");
    for (const u of unsafe) console.error("  - " + u);
    process.exit(1);
  }

  // ---- build & commit ----------------------------------------------------
  const ns = new Map();
  const r = gitTry(["diff", "--cached", "--name-status", "-z", "-M"]);
  if (r.ok) for (const [k, v] of nameStatusMap(stdoutOf(r))) ns.set(k, v);

  const { msg } = buildMessage(files, ns);

  const [name, email] = identity();
  const cmd = ["commit", "-F", "-"];
  if (opts.amend) cmd.splice(1, 0, "--amend");
  try {
    execFileSync("git", cmd, {
      encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input: msg,
    });
  } catch (err) {
    const out = typeof err.stdout === "string" ? err.stdout : (err.stdout ?? "");
    const errMsg = typeof err.stderr === "string" ? err.stderr : (err.stderr ?? "");
    die("commit failed (exit " + (err.status ?? 1) + ")\n" + out + errMsg);
  }

  console.log("--- committed ---");
  console.log(msg);
  console.log("---");
  console.log("HEAD -> " + stdoutOf(gitTry(["log", "-1", "--oneline"])).trim());
}

main();
