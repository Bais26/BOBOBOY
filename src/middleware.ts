import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  role: 'admin' | 'karyawan'
  exp: number
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // ✅ HALAMAN PUBLIK
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // 🚫 BELUM LOGIN
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let payload: JWTPayload
  try {
    payload = jwtDecode<JWTPayload>(token)
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ⏰ TOKEN EXPIRED
  if (payload.exp * 1000 < Date.now()) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔐 ROLE GUARD
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/karyawan/dashboard', request.url))
  }

  if (pathname.startsWith('/karyawan') && payload.role !== 'karyawan') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/karyawan/:path*'],
}
