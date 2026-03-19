// ─────────────────────────────────────────────────────────────────────────────
// App.jsx
//
// Root of the app. Sets up:
//   - BrowserRouter     — enables client-side routing
//   - Layout            — conditionally renders Sidebar or Navbar
//   - ProtectedRoute    — blocks unauthenticated or wrong-role access
//   - All page routes
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login               from './pages/Login'
import RegisterDonor       from './pages/RegisterDonor'
import RegisterHospital    from './pages/RegisterHospital'
import HospitalDashboard   from './pages/HospitalDashboard'
import DonorDashboard      from './pages/DonorDashboard'
import HospitalNotifications from './pages/HospitalNotifications'
import Navbar              from './components/Navbar'
import Sidebar             from './components/Sidebar'

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps pages that require authentication.
// If no user is logged in → redirect to /login
// If the logged-in user's role doesn't match → redirect to /login
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user)                        return <Navigate to="/login" />
  if (role && user.role !== role)   return <Navigate to="/login" />
  return children
}

// ─── Layout ───────────────────────────────────────────────────────────────────
// Decides what chrome to show around the page content:
//   - Auth pages (login, register) → top Navbar, no Sidebar
//   - App pages (dashboard etc.)   → left Sidebar, no Navbar
function Layout() {
  const { user }    = useAuth()
  const location    = useLocation()

  // These pages use the top Navbar instead of the Sidebar
  const authPages   = ['/', '/login', '/register/donor', '/register/hospital']
  const isAuthPage  = authPages.includes(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar — shown on all app pages once logged in */}
      {!isAuthPage && user && <Sidebar />}

      <div className="flex-1 flex flex-col">

        {/* Navbar — shown only on auth/landing pages */}
        {isAuthPage && <Navbar />}

        <Routes>
          {/* Default → redirect to login */}
          <Route path="/"                     element={<Navigate to="/login" />} />

          {/* ── Auth pages ───────────────────────────────────────────────── */}
          <Route path="/login"                element={<Login />} />
          <Route path="/register/donor"       element={<RegisterDonor />} />
          <Route path="/register/hospital"    element={<RegisterHospital />} />

          {/* ── Hospital pages ───────────────────────────────────────────── */}
          <Route path="/hospital/dashboard"   element={
            <ProtectedRoute role="HOSPITAL">
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hospital/notifications" element={
            <ProtectedRoute role="HOSPITAL">
              <HospitalNotifications />
            </ProtectedRoute>
          } />

          {/* ── Donor pages ──────────────────────────────────────────────── */}
          <Route path="/donor/dashboard"      element={
            <ProtectedRoute role="DONOR">
              <DonorDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}