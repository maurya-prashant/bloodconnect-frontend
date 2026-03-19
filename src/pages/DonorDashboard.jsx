// import { useState, useEffect } from 'react'
// import api from '../api/axios'
// import { useAuth } from '../context/AuthContext'

// export default function DonorDashboard() {
//   const { user } = useAuth()
//   const [notifications, setNotifications] = useState([])
//   const [message, setMessage] = useState('')

//   const fetchNotifications = async () => {
//     try {
//       const res = await api.get(`/donor/${user.id}/notifications`)
//       setNotifications(res.data)
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   useEffect(() => { fetchNotifications() }, [])

//   const respond = async (bloodRequestId, status) => {
//     try {
//       await api.put(`/donor/${user.id}/respond`, {
//         bloodRequestId,
//         donorResponseStatus: status
//       })
//       setMessage(`✅ Response submitted: ${status}`)
//       fetchNotifications()
//       setTimeout(() => setMessage(''), 3000)
//     } catch (err) {
//       setMessage('❌ Failed to respond')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-red-50 p-6">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold text-red-600 mb-6">❤️ Donor Dashboard — {user.name}</h1>

//         {message && <p className="text-sm mb-4 font-medium text-green-600">{message}</p>}

//         <div className="bg-white rounded-2xl shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">Blood Request Notifications</h2>

//           {notifications.length === 0 ? (
//             <p className="text-gray-400 text-sm">No notifications yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {notifications.map(n => (
//                 <div key={n.id} className="border border-gray-200 rounded-xl p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         🏥 {n.bloodRequest.hospital.name}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         🩸 {n.bloodRequest.bloodType} — {n.bloodRequest.unitsNeeded} units
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         ⚡ {n.bloodRequest.urgencyLevel} | 📍 {n.distanceKm.toFixed(1)} km away
//                       </p>
//                     </div>
//                     <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                       n.status === 'NOTIFIED' ? 'bg-blue-100 text-blue-700' :
//                       n.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
//                       'bg-red-100 text-red-700'
//                     }`}>
//                       {n.status}
//                     </span>
//                   </div>

//                   {n.status === 'NOTIFIED' && (
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => respond(n.bloodRequest.id, 'ACCEPTED')}
//                         className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
//                       >
//                         ✅ Accept
//                       </button>
//                       <button
//                         onClick={() => respond(n.bloodRequest.id, 'DECLINED')}
//                         className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
//                       >
//                         ❌ Decline
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const btShort = (bt) => bt?.replace('_POSITIVE','+').replace('_NEGATIVE','−').replace('_','') || ''

export default function DonorDashboard() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('ALL')

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/donor/${user.id}/notifications`)
      setNotifications(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchNotifications() }, [])

  const respond = async (bloodRequestId, status) => {
    try {
      await api.put(`/donor/${user.id}/respond`, { bloodRequestId, donorResponseStatus: status })
      setMessage(`✅ Response submitted: ${status}`)
      fetchNotifications()
      setTimeout(() => setMessage(''), 3000)
    } catch { setMessage('❌ Failed to respond') }
  }

  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.status === filter)

  const accepted = notifications.filter(n => n.status === 'ACCEPTED').length
  const declined = notifications.filter(n => n.status === 'DECLINED').length
  const pending = notifications.filter(n => n.status === 'NOTIFIED').length

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

  const filters = ['ALL', 'NOTIFIED', 'ACCEPTED', 'DECLINED']

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Blood donation requests near you</p>
      </div>

      {message && (
        <div className="mb-4 text-sm px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: notifications.length, color: 'text-gray-900' },
          { label: 'Pending', value: pending, color: 'text-blue-600' },
          { label: 'Accepted', value: accepted, color: 'text-green-600' },
          { label: 'Declined', value: declined, color: 'text-red-500' },
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
          <button key={f}
            onClick={() => setFilter(f)}
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

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">No notifications here.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(n => (
              <div key={n.id} className="px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xs font-medium text-red-600 flex-shrink-0">
                      {btShort(n.bloodRequest?.bloodType)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {n.bloodRequest?.hospital?.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {n.bloodRequest?.bloodType} · {n.bloodRequest?.unitsNeeded} units · {n.distanceKm?.toFixed(1)} km away
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${urgencyColor(n.bloodRequest?.urgencyLevel)}`}>
                          {n.bloodRequest?.urgencyLevel}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(n.status)}`}>
                          {n.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {n.status === 'NOTIFIED' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => respond(n.bloodRequest.id, 'ACCEPTED')}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respond(n.bloodRequest.id, 'DECLINED')}
                        className="text-xs bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
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
    </div>
  )
}