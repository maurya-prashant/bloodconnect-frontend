import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const BLOOD_TYPES = ['A_POSITIVE','A_NEGATIVE','B_POSITIVE','B_NEGATIVE','AB_POSITIVE','AB_NEGATIVE','O_POSITIVE','O_NEGATIVE']
const formatBlood = b => b.replace('_POSITIVE', '+').replace('_NEGATIVE', '-').replace('_', '')

export default function RegisterDonor() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    bloodType: 'A_POSITIVE', city: '', latitude: '', longitude: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locLoading, setLocLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const getLocation = () => {
    if (!navigator.geolocation) return setError('Geolocation not supported by your browser')
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }))
        setLocLoading(false)
      },
      () => { setError('Location access denied. Please enter manually.'); setLocLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register/donor', {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-5/12 bg-red-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5"></div>

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl">BloodConnect</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-5xl font-black text-white leading-tight mb-6">
            Be someone's<br/>hero today.
          </h2>
          <p className="text-red-100 text-lg leading-relaxed max-w-sm mb-10">
            Register as a donor and get notified the moment a hospital nearby needs your blood type.
          </p>
          <div className="space-y-4">
            {[
              'Get notified for matching blood type requests',
              '56-day safety rule automatically enforced',
              'Accept or decline from your dashboard',
              'GPS auto-detects your location',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="text-red-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-red-200 text-xs relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto relative">

        {/* Back button */}
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

        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 mt-10 lg:mt-0 lg:hidden">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg">BloodConnect</span>
        </Link>

        <div className="w-full max-w-lg">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create donor account</h1>
          <p className="text-gray-400 text-sm mb-8">Fill in your details to start saving lives</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Prashant Maurya" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Password + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Type</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm({ ...form, bloodType: b })}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      form.bloodType === b
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {formatBlood(b)}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <input
                name="city" value={form.city} onChange={handleChange}
                placeholder="Varanasi" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <button
                  type="button" onClick={getLocation} disabled={locLoading}
                  className="flex items-center gap-1.5 text-xs text-red-600 font-medium hover:text-red-700 disabled:opacity-50 transition-colors"
                >
                  {locLoading ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                    </svg>
                  )}
                  {locLoading ? 'Detecting...' : 'Use my location'}
                </button>
              </div>

              {!form.latitude ? (
                <div className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Click "Use my location" to detect automatically
                </div>
              ) : (
                <div className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-sm text-green-700 flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  Location detected successfully
                  <span className="ml-auto text-xs text-green-500">{form.latitude}, {form.longitude}</span>
                </div>
              )}

              <input type="hidden" name="latitude" value={form.latitude}/>
              <input type="hidden" name="longitude" value={form.longitude}/>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-red-100 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Donor Account'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-medium hover:underline">Sign in</Link>
            {' · '}
            <Link to="/register/hospital" className="text-red-600 font-medium hover:underline">Register as Hospital</Link>
          </p>
        </div>
      </div>
    </div>
  )
}