import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'DONOR' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data)
      if (res.data.role === 'DONOR') navigate('/donor/dashboard')
      else navigate('/hospital/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-red-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5"></div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl">BloodConnect</span>
        </Link>

        {/* Center quote */}
        <div className="relative z-10">
          <h2 className="font-display text-5xl font-black text-white leading-tight mb-6">
            Every second<br/>counts.
          </h2>
          <p className="text-red-100 text-lg leading-relaxed max-w-sm">
            Donors and hospitals connected in real time. Your next login could save a life.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="flex gap-8 relative z-10">
          {[
            { num: '5 km', label: 'Smart radius' },
            { num: '8', label: 'Blood types' },
            { num: '<30s', label: 'Match time' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-white font-display text-2xl font-bold">{s.num}</div>
              <div className="text-red-200 text-xs uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative">

        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 mt-10 lg:mt-0 lg:hidden">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg">BloodConnect</span>
        </Link>

        {/* Back button - top left of right panel */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-full shadow-sm transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        </div>

        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => setForm({ ...form, role: 'DONOR' })}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
        form.role === 'DONOR'
          ? 'bg-red-600 border-red-600 text-white'
          : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
      }`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
      </svg>
      Donor
    </button>
    <button
      type="button"
      onClick={() => setForm({ ...form, role: 'HOSPITAL' })}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
        form.role === 'HOSPITAL'
          ? 'bg-gray-900 border-gray-900 text-white'
          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
      }`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      Hospital
    </button>
  </div>
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-red-100"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register/donor" className="text-red-600 font-medium hover:underline">Register as Donor</Link>
            {' '}or{' '}
            <Link to="/register/hospital" className="text-red-600 font-medium hover:underline">Hospital</Link>
          </p>
        </div>
      </div>

    </div>
  )
}