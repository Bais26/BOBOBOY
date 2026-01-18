// lib/auth.ts
import { jwtDecode } from 'jwt-decode'

interface Payload {
  role: 'admin' | 'karyawan'
  exp: number
}

export function getAuth() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    const payload = jwtDecode<Payload>(token)

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('access_token')
      return null
    }

    return { token, payload }
  } catch {
    return null
  }
}
