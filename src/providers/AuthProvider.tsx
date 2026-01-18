'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')

    // 🟢 ROUTE PUBLIK
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false)
      return
    }

    // 🔴 BELUM LOGIN
    if (!token) {
      router.replace('/login')
      return
    }

    // 🔐 ROLE GUARD
    if (pathname.startsWith('/admin') && role !== 'admin') {
      router.replace('/karyawan/dashboard')
      return
    }

    if (pathname.startsWith('/karyawan') && role !== 'karyawan') {
      router.replace('/admin/dashboard')
      return
    }

    setLoading(false)
  }, [pathname])

  // ⏳ SUPAYA TIDAK KEDIP
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    )
  }

  return <>{children}</>
}
