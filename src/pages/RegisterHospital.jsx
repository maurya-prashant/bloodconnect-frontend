import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function RegisterHospital() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Form state — latitude and longitude can be auto-filled via GPS
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    latitude: '',
    longitude: ''
  })

  const [error, setError] = useState('')

  // Tracks whether location is being fetched (shows loading state on button)
  const [locating, setLocating] = useState(false)

  // ─── Auto-fetch location using browser Geolocation API ───────────
  // Browser asks for permission first.
  // On success → fills latitude and longitude automatically.
  // On failure → user can enter manually.
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please enter location manually.')
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      // Success — fill lat/lng fields
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        })
        setLocating(false)
      },
      // Error — user denied or unavailable
      () => {
        setError('Could not fetch location. Please enter latitude and longitude manually.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // ─── Submit registration form ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/register/hospital', {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      })
      // Save token and user info in AuthContext + localStorage
      login(res.data)
      // Redirect to hospital dashboard after successful registration
      navigate('/hospital/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Page title */}
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          Register as Hospital
        </h2>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 px-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Hospital Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>

          {/* ── Location Section ──────────────────────────────────────
              Hospital can either:
              1. Click "Use My Location" to auto-fill via GPS
              2. Enter latitude and longitude manually
              These coordinates are used by Haversine formula
              to find donors within the hospital's search radius
              when a blood request is raised.
          ─────────────────────────────────────────────────────────── */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              {/* Auto-fill location button */}
              <button
                type="button"
                onClick={fetchLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                {locating ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    Locating...
                  </>
                ) : (
                  <>📍 Use My Location</>
                )}
              </button>
            </div>

            {/* Latitude and Longitude side by side */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude e.g. 26.8467"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={form.latitude}
                  onChange={e => setForm({ ...form, latitude: e.target.value })}
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude e.g. 80.9462"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={form.longitude}
                  onChange={e => setForm({ ...form, longitude: e.target.value })}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              📌 Click "Use My Location" or enter manually
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>

        {/* Link to login page */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}