import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

const STATUS_COLORS = {
  NOTIFIED: 'bg-blue-50 text-blue-600 border-blue-200',
  ACCEPTED: 'bg-green-50 text-green-600 border-green-200',
  DECLINED: 'bg-red-50 text-red-600 border-red-200',
}

const URGENCY_COLORS = {
  HIGH:   'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-orange-50 text-orange-600 border-orange-200',
  LOW:    'bg-gray-50 text-gray-500 border-gray-200',
}

const formatBlood = b => b.replace('_POSITIVE', '+').replace('_NEGATIVE', '-').replace('_', '')
const formatDate  = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function DonorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/donor/${user.id}/notifications`)
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const respond = async (bloodRequestId, status) => {
    setResponding(bloodRequestId)
    try {
      await api.put(`/donor/${user.id}/respond`, { bloodRequestId, donorResponseStatus: status })
      await fetchNotifications()
    } catch (err) {
      console.error(err)
    } finally {
      setResponding(null)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.status === filter)

  const counts = {
    total:    notifications.length,
    pending:  notifications.filter(n => n.status === 'NOTIFIED').length,
    accepted: notifications.filter(n => n.status === 'ACCEPTED').length,
    declined: notifications.filter(n => n.status === 'DECLINED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-400 text-sm">Blood donation requests near you</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',    value: counts.total,    color: 'text-gray-900' },
            { label: 'Pending',  value: counts.pending,  color: 'text-blue-600' },
            { label: 'Accepted', value: counts.accepted, color: 'text-green-600' },
            { label: 'Declined', value: counts.declined, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-xs text-gray-400 font-medium mb-2">{s.label}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'NOTIFIED', 'ACCEPTED', 'DECLINED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                filter === f
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-red-200 hover:text-red-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="w-6 h-6 animate-spin text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <p className="text-sm">No notifications here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(n => (
                <div key={n.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${URGENCY_COLORS[n.bloodRequest?.urgencyLevel] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {n.bloodRequest?.urgencyLevel || 'UNKNOWN'}
                        </span>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                          {formatBlood(n.bloodRequest?.bloodType || '')}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[n.status]}`}>
                          {n.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {n.bloodRequest?.hospital?.name || 'Unknown Hospital'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-1">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {formatDate(n.notifiedAt)}
                        </span>
                        {n.distanceKm && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {n.distanceKm.toFixed(1)} km away
                          </span>
                        )}
                        {n.bloodRequest?.unitsNeeded && (
                          <span>{n.bloodRequest.unitsNeeded} units needed</span>
                        )}
                      </div>
                      {n.bloodRequest?.notes && (
                        <p className="text-xs text-gray-400 italic mt-1">"{n.bloodRequest.notes}"</p>
                      )}
                    </div>
                    {n.status === 'NOTIFIED' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => respond(n.bloodRequest.id, 'ACCEPTED')}
                          disabled={responding === n.bloodRequest.id}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-semibold rounded-xl transition-all"
                        >
                          {responding === n.bloodRequest.id ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => respond(n.bloodRequest.id, 'DECLINED')}
                          disabled={responding === n.bloodRequest.id}
                          className="px-4 py-2 bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 text-xs font-semibold rounded-xl transition-all"
                        >
                          Decline
                        </button>
                      </div>
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