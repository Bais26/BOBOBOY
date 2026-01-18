'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  UserIcon,
  HomeIcon,
  PhoneIcon,
  BanknotesIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function ProfilePage() {
  const [karyawanData, setKaryawanData] = useState<any>(null)
  const [karyawanDetail, setKaryawanDetail] = useState<any>(null)
  const [editedDetail, setEditedDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    fetchKaryawanData()
  }, [])

  const getToken = () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace('/login')
      throw new Error('Token tidak ditemukan')
    }
    return token
  }

  const getUserId = () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      router.replace('/login')
      throw new Error('User ID tidak ditemukan')
    }
    return userId
  }

  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchKaryawanData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userId = getUserId()
      const headers = getAuthHeaders()

      const resUser = await fetch(
        `${API_URL}/v1/karyawan/${userId}`,
        { headers }
      )

      if (resUser.status === 401) {
        localStorage.clear()
        router.replace('/login')
        return
      }

      if (!resUser.ok) throw new Error('Gagal mengambil data karyawan')

      const userJson = await resUser.json()
      setKaryawanData(userJson.data)

      if (userJson.data.role !== 'admin') {
        const resDetail = await fetch(
          `${API_URL}/v1/karyawan/${userId}/detail`,
          { headers }
        )

        if (!resDetail.ok) throw new Error('Gagal mengambil detail')

        const detailJson = await resDetail.json()
        setKaryawanDetail(detailJson.data)
        setEditedDetail(detailJson.data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedDetail) return

    try {
      setIsSaving(true)
      const userId = getUserId()
      const headers = getAuthHeaders()

      const res = await fetch(
        `${API_URL}/v1/karyawan/${userId}/detail`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(editedDetail),
        }
      )

      if (!res.ok) throw new Error('Gagal update data')

      const json = await res.json()
      setKaryawanDetail(json.data)
      setIsEditing(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  /* ================= UI TETAP ================= */

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!karyawanData) return null

  const isAdmin = karyawanData.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => router.back()} className="flex gap-2 mb-4">
        <ArrowLeftIcon className="w-5" /> Kembali
      </button>

      <h1 className="text-xl font-bold mb-4">
        {karyawanData.full_name}
      </h1>

      {!isAdmin && (
        <>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)}>Batal</button>
              <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
