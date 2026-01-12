'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return alert('Token tidak valid')

    setIsLoading(true)

    try {
      await api.post(`/v1/auth/reset-password?token=${token}`, {
        password,
        confirm_password: confirmPassword,
      })

      alert('Password berhasil direset')
      router.push('/login')
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Reset password gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600">
          Masukkan password baru Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Konfirmasi password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? 'Menyimpan...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  )
}
