import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Daftar route yang memerlukan authentication
  const protectedRoutes = ['/dashboard'];
  const authRoutes = ['/login', '/register'];
  
  const { pathname } = request.nextUrl;
  
  // Simulasi check authentication - ganti dengan logic auth Anda
  const isAuthenticated = request.cookies.has('auth-token'); // atau method lain
  
  // Jika user sudah login dan mengakses auth pages, redirect ke dashboard
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Jika user belum login dan mengakses protected routes, redirect ke login
  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};