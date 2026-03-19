import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const statusColor = (s) => ({
  NOTIFIED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
})[s] || 'bg-gray-100 text-gray-500'

const urgencyColor = (u) => ({
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-green-100 text-green-700',
})[u] || 'bg-gray-100 text-gray-600'

const btShort = (bt) => bt?.replace('_POSITIVE','+').replace('_NEGATIVE','−').replace('_','') || ''

export default function HospitalNotifications() {
  const { user } = useAuth()
  const [responses, setResponses] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get(`/hospital/${user.id}/responses`)
      .then(res => setResponses(res.data))
      .catch(console.error)
  }, [])

  const filters = ['ALL', 'ACCEPTED', 'DECLINED', 'NOTIFIED']
  const filtered = filter === 'ALL' ? responses : responses.filter(r => r.status === filter)

  const accepted = responses.filter(r => r.status === 'ACCEPTED').length
  const declined = responses.filter(r => r.status === 'DECLINED').length
  const notified = responses.filter(r => r.status === 'NOTIFIED').length

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Donor responses to your blood requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Responses', value: responses.length, color: 'text-gray-900' },
          { label: 'Accepted', value: accepted, color: 'text-green-600' },
          { label: 'Declined', value: declined, color: 'text-red-500' },
          { label: 'Pending Reply', value: notified, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-medium ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              filter === f
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Responses list */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            No responses yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(r => (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  {/* Donor avatar */}
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-sm font-semibold text-red-600 flex-shrink-0">
                    {r.donor?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.donor?.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {r.donor?.bloodType} · {r.donor?.city} · {r.distanceKm?.toFixed(1)} km away
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">
                        Request: {r.bloodRequest?.bloodType} — {r.bloodRequest?.unitsNeeded} units
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyColor(r.bloodRequest?.urgencyLevel)}`}>
                    {r.bloodRequest?.urgencyLevel}
                  </span>
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xs font-medium text-red-600">
                    {btShort(r.bloodRequest?.bloodType)}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {r.respondedAt
                      ? new Date(r.respondedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
                      : 'No reply yet'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}