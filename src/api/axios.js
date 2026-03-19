import axios from 'axios'

// ─── API Base URL ─────────────────────────────────────────────────────────────
// Points to the deployed Railway backend.
// All requests go to https://bloodconnect-production-7cb6.up.railway.app/api/v1
const api = axios.create({
  baseURL: 'https://bloodconnect-production-7cb6.up.railway.app/api/v1',
})

// ─── Auth Interceptor ─────────────────────────────────────────────────────────
// Automatically attaches the JWT token to every outgoing request.
// Token is stored in localStorage after login/register.
// Without this, all protected endpoints would return 401 Unauthorized.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api