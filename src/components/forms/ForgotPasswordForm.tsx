'use client'

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/v1/auth/forgot-password', { email })
      alert('Link reset password dikirim ke email')
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Gagal mengirim email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lupa Password
        </h1>
        <p className="text-gray-600">
          Masukkan email untuk reset password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-blue-600 text-sm">
          Kembali ke login
        </Link>
      </div>
    </div>
  )
}
