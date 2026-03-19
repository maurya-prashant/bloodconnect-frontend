import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, Bell, LogOut, Heart } from 'lucide-react'

// ── Nav items per role ────────────────────────────────────────────────────────
// Settings removed from both — no settings page exists yet

const HospitalNav = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/hospital/dashboard'      },
  { label: 'Donors',        icon: Users,           path: '/hospital/donors'         },
  { label: 'Notifications', icon: Bell,            path: '/hospital/notifications'  },
]

const DonorNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/donor/dashboard' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location         = useLocation()
  const navigate         = useNavigate()

  // Pick the right nav list based on who is logged in
  const navItems = user?.role === 'HOSPITAL' ? HospitalNav : DonorNav

  // Generate initials for the avatar e.g. "Prashant Maurya" → "PM"
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">BloodConnect</div>
            <div className="text-xs text-gray-400">
              {user?.role === 'HOSPITAL' ? 'Hospital Portal' : 'Donor Portal'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Links ──────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={16} className={active ? 'text-red-600' : 'text-gray-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* ── User Card + Logout ────────────────────────────────────────────── */}
      <div className="mx-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2.5 mb-3">
          {/* Avatar with initials */}
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.role}</div>
          </div>
        </div>

        {/* Logout button — clears auth context and redirects to /login */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 py-1.5 rounded-lg transition"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    </div>
  )
}