'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'


interface Payload {
  role: 'admin' | 'karyawan'
  exp: number
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      router.replace('/login')
      return
    }

    try {
      const payload = jwtDecode<Payload>(token)

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token')
        router.replace('/login')
        return
      }

      router.replace(
        payload.role === 'admin'
          ? '/admin/dashboard'
          : '/karyawan/dashboard'
      )
    } catch {
      router.replace('/login')
    }
  }, [])

  return null // atau loading spinner
}
