# AGENTS.md — Finance Dashboard (frontend)

Project ini adalah frontend untuk loan-system.

- Frontend: `/mnt/NewVolume/Learning/finance-dashboard` — remote `github.com/khisan/finance-dashboard.git`, branch `main`.
- Backend: `/mnt/NewVolume/Learning/loan-system` — remote `github.com/khisan/loan-system.git`, branch `main`.
- Hermes project: `loan-system` (`p_7f69b4d7`). Primary folder = backend; folder #2 = frontend ini, label `Finance Dashboard (frontend)`.
- Stack: Vite + React/TypeScript. Perintah dari `package.json`: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.

**Konfigurasi API:**
- Vite dev server port: `5173` (default Vite; tidak ada blok `server` di `vite.config.js`)
- Base URL API diambil dari `import.meta.env.VITE_API_BASE_URL` (nama key saja; nilai di `.env` jangan dibaca/dicopied). Tidak ada proxy `/api` di `vite.config.js`.
- Jangan ekstrak token dari HTML/header.

**Aturan kerja:**
- User melakukan commit manual di VSCodium. Jangan commit/push atas nama user tanpa izin eksplisit. Cek dulu apakah repo ini memakai hook `commit-msg` seperti backend sebelum menyebut detail pesan otomatis.
- Endpoint backend yang biasa dipakai: `/api/loans`, `/api/guarantors`, `/api/invoices`, `/api/disbursements`.
- Typo yang sudah ada di collection Hoppscotch: `Get Disbursement By Id` memakai `/api/disbursement/...`, sedangkan backend `/api/disbursements/...`. Jangan diubah tanpa izin.
- Verifikasi pakai GET dulu sebelum POST/PUT/DELETE supaya DB tidak berubah.
- File `AGENTS.md` ini harus tetap di-track; jangan dimasukkan ke `.gitignore`.
- Jangan membaca atau menyalin isi `.env`. Semua secret/token/password/JWT/connection string ditulis `[REDACTED]`.

**Dilarang keras:**
- Jangan menjalankan request mutasi (POST/PUT/DELETE) tanpa verifikasi GET terlebih dahulu.
- Jangan mengubah typo endpoint tanpa izin.
- Jangan commit/push atas nama user.