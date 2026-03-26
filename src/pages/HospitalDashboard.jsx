import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

const URGENCY_COLORS = {
  HIGH:   'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-orange-50 text-orange-600 border-orange-200',
  LOW:    'bg-gray-50 text-gray-500 border-gray-200',
}

const STATUS_COLORS = {
  PENDING:   'bg-blue-50 text-blue-600 border-blue-200',
  FULFILLED: 'bg-green-50 text-green-600 border-green-200',
  CANCELLED: 'bg-gray-50 text-gray-400 border-gray-200',
}

const BLOOD_TYPES = ['A_POSITIVE','A_NEGATIVE','B_POSITIVE','B_NEGATIVE','AB_POSITIVE','AB_NEGATIVE','O_POSITIVE','O_NEGATIVE']
const formatBlood = b => b.replace('_POSITIVE', '+').replace('_NEGATIVE', '-').replace('_', '')
const formatDate  = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function HospitalDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    bloodType: 'A_POSITIVE',
    urgencyLevel: 'MEDIUM',
    unitsNeeded: 1,
    radiusKm: 5,
    notes: ''
  })

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/hospital/${user.id}/requests`)
      setRequests(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post(`/hospital/${user.id}/request`, {
        ...form,
        unitsNeeded: parseInt(form.unitsNeeded),
        radiusKm: parseFloat(form.radiusKm),
      })
      setSuccess('Blood request raised! Matching donors are being notified.')
      setShowForm(false)
      setForm({ bloodType: 'A_POSITIVE', urgencyLevel: 'MEDIUM', unitsNeeded: 1, radiusKm: 5, notes: '' })
      await fetchRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise request.')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelRequest = async (rid) => {
    setCancelling(rid)
    try {
      await api.put(`/hospital/${user.id}/request/${rid}/cancel`)
      await fetchRequests()
    } catch (err) {
      console.error(err)
    } finally {
      setCancelling(null)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const counts = {
    total:     requests.length,
    pending:   requests.filter(r => r.status === 'PENDING').length,
    fulfilled: requests.filter(r => r.status === 'FULFILLED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Blood Requests</h1>
            <p className="text-gray-400 text-sm">Manage and raise blood donation requests</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-red-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Raise Request
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-5">New Blood Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Blood Type</label>
                  <select name="bloodType" value={form.bloodType} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    {BLOOD_TYPES.map(b => <option key={b} value={b}>{formatBlood(b)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Urgency</label>
                  <select name="urgencyLevel" value={form.urgencyLevel} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Units Needed</label>
                  <input type="number" name="unitsNeeded" value={form.unitsNeeded} onChange={handleChange}
                    min="1" max="20" required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Radius (km)</label>
                  <input type="number" name="radiusKm" value={form.radiusKm} onChange={handleChange}
                    min="1" max="20" required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (optional)</label>
                <input name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any additional information for donors..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"/>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
                  {submitting ? 'Sending notifications...' : 'Raise & Notify Donors'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl text-sm transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: counts.total,     color: 'text-gray-900' },
            { label: 'Pending',   value: counts.pending,   color: 'text-blue-600' },
            { label: 'Fulfilled', value: counts.fulfilled, color: 'text-green-600' },
            { label: 'Cancelled', value: counts.cancelled, color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-xs text-gray-400 font-medium mb-2">{s.label}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="w-6 h-6 animate-spin text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
              </svg>
              <p className="text-sm">No requests yet. Raise your first request.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {requests.map(r => (
                <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${URGENCY_COLORS[r.urgencyLevel]}`}>
                          {r.urgencyLevel}
                        </span>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                          {formatBlood(r.bloodType)}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {formatDate(r.createdAt)}
                        </span>
                        <span>{r.unitsNeeded} units needed</span>
                        {r.notes && <span className="italic">"{r.notes}"</span>}
                      </div>
                    </div>
                    {r.status === 'PENDING' && (
                      <button
                        onClick={() => cancelRequest(r.id)}
                        disabled={cancelling === r.id}
                        className="text-xs text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                      >
                        {cancelling === r.id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}