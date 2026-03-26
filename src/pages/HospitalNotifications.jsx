import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
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

export default function HospitalNotifications() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchResponses() }, [])

  const fetchResponses = async () => {
    try {
      const res = await api.get(`/hospital/${user.id}/responses`)
      setResponses(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const filtered = filter === 'ALL' ? responses : responses.filter(r => r.status === filter)

  const counts = {
    total:    responses.length,
    notified: responses.filter(r => r.status === 'NOTIFIED').length,
    accepted: responses.filter(r => r.status === 'ACCEPTED').length,
    declined: responses.filter(r => r.status === 'DECLINED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Donor Responses</h1>
          <p className="text-gray-400 text-sm">See which donors have accepted or declined your requests</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',    value: counts.total,    color: 'text-gray-900' },
            { label: 'Notified', value: counts.notified, color: 'text-blue-600' },
            { label: 'Accepted', value: counts.accepted, color: 'text-green-600' },
            { label: 'Declined', value: counts.declined, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="text-xs text-gray-400 font-medium mb-2">{s.label}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

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
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <p className="text-sm">No donor responses yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(r => (
                <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                        {r.donor?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {r.donor?.name || 'Unknown Donor'}
                          </span>
                          {r.donor?.bloodType && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                              {formatBlood(r.donor.bloodType)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {r.bloodRequest?.urgencyLevel && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${URGENCY_COLORS[r.bloodRequest.urgencyLevel]}`}>
                              {r.bloodRequest.urgencyLevel}
                            </span>
                          )}
                          {r.bloodRequest?.bloodType && (
                            <span className="text-xs text-gray-400">
                              Request: {formatBlood(r.bloodRequest.bloodType)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Notified {formatDate(r.notifiedAt)}
                          </span>
                          {r.distanceKm && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {r.distanceKm.toFixed(1)} km away
                            </span>
                          )}
                          {r.respondedAt && (
                            <span>Responded {formatDate(r.respondedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex-shrink-0 ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
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