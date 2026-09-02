import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password wajib diisi!')
      return
    }

    try {
      // Panggil fungsi login dari AuthContext
      login({ email })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError('Login gagal. Periksa kembali kredensial Anda.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      {/* Material Elevation Card */}
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/60 p-8 transition-all">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl mb-3 border border-blue-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Selamat Datang</h1>
          <p className="text-sm text-slate-400 mt-1">Masukkan akun Anda untuk melanjutkan</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-900/60 text-white pl-11 pr-4 py-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/60 text-white pl-11 pr-11 py-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember / Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0" />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="text-blue-400 hover:underline">Lupa password?</a>
          </div>

          {/* Material Style Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-900 text-white font-medium py-3 rounded-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all group"
          >
            <span>Masuk Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </form>

      </div>
    </div>
  )
}