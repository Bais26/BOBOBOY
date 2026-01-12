import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    redirect('/login')
  }

  const payload: any = jwtDecode(token)

  redirect(
    payload.role === 'admin'
      ? '/admin/dashboard'
      : '/karyawan/dashboard'
  )
}
