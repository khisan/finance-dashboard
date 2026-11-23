const AUTH_STORAGE_KEYS = ["authToken", "user"] as const

/** Hapus sesi lokal agar state login tidak kembali aktif setelah redirect. */
export function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

/** Lempar user ke halaman login ketika sesi tidak lagi valid. */
export function redirectToLogin() {
  clearAuthStorage()

  // Sudah di halaman login (mis. request gagal saat submit) — tidak perlu reload.
  if (window.location.pathname === "/login") return

  window.location.replace("/login")
}
