// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function Navbar() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
//       <Link to="/" className="text-xl font-bold tracking-wide">
//         🩸 BloodConnect
//       </Link>
//       <div className="flex items-center gap-4">
//         {!user ? (
//           <>
//             <Link to="/login" className="hover:underline">Login</Link>
//             <Link to="/register/donor" className="hover:underline">Register as Donor</Link>
//             <Link to="/register/hospital" className="hover:underline">Register as Hospital</Link>
//           </>
//         ) : (
//           <>
//             <span className="text-sm">👋 {user.name} ({user.role})</span>
//             <button
//               onClick={handleLogout}
//               className="bg-white text-red-600 px-3 py-1 rounded font-semibold hover:bg-red-50"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   )
// }

import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">♥</span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">BloodConnect</div>
          <div className="text-xs text-gray-500">Save lives, donate blood</div>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <Link to="/login" className="text-gray-600 hover:text-red-600">Login</Link>
        <Link to="/register/donor" className="text-gray-600 hover:text-red-600">Register as Donor</Link>
        <Link to="/register/hospital" className="text-gray-600 hover:text-red-600">Register as Hospital</Link>
      </div>
    </nav>
  )
}