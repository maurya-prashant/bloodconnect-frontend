import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RegisterDonor from './pages/RegisterDonor'
import RegisterHospital from './pages/RegisterHospital'
import DonorDashboard from './pages/DonorDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import HospitalNotifications from './pages/HospitalNotifications'

function PrivateRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/donor" element={<RegisterDonor />} />
        <Route path="/register/hospital" element={<RegisterHospital />} />

        {/* Donor */}
        <Route path="/donor/dashboard" element={
          <PrivateRoute role="DONOR"><DonorDashboard /></PrivateRoute>
        }/>

        {/* Hospital */}
        <Route path="/hospital/dashboard" element={
          <PrivateRoute role="HOSPITAL"><HospitalDashboard /></PrivateRoute>
        }/>
        <Route path="/hospital/notifications" element={
          <PrivateRoute role="HOSPITAL"><HospitalNotifications /></PrivateRoute>
        }/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}