'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CalendarIcon, CpuChipIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface GenerateJadwalPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface OfficeLocation {
  id: string
  name: string
  capacity: number
  address: string
  latitude: number
  longitude: number
  radius: number
  is_active: boolean
}

interface GenerateScheduleRequest {
  start_date: string
  end_date: string
  office_capacity: number
  min_wfo_per_week: number
  max_wfo_per_week: number
  office_location_id?: string
  population_size?: number
  generations?: number
  mutation_rate?: number
}

interface GenerateScheduleResponse {
  message: string
  total_schedules: number
  start_date: string
  end_date: string
  affected_employees: number
}

// Helper function untuk mendapatkan auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
}

export default function GenerateJadwalPopup({ isOpen, onClose, onSuccess }: GenerateJadwalPopupProps) {
  // State untuk form data
  const [formData, setFormData] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    office_capacity: '50',
    min_wfo_per_week: '2',
    max_wfo_per_week: '5',
    office_location_id: '',
    population_size: '50',
    generations: '100',
    mutation_rate: '10'
  })

  // State untuk loading, error, dan data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Load office locations saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      loadOfficeLocations()
      // Set default values
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      setFormData(prev => ({
        ...prev,
        start_date: today.toISOString().split('T')[0],
        end_date: nextWeek.toISOString().split('T')[0]
      }))
    }
  }, [isOpen])

  const loadOfficeLocations = async () => {
    try {
      const token = getAuthToken()
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/locations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setOfficeLocations(data.filter((loc: OfficeLocation) => loc.is_active))
        
        // Set default office location jika ada
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            office_location_id: data[0].id
          }))
        }
      }
    } catch (err) {
      console.error('Failed to load office locations:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = (): boolean => {
    // Validasi tanggal
    if (!formData.start_date) {
      setError('Tanggal mulai harus diisi')
      return false
    }

    if (!formData.end_date) {
      setError('Tanggal selesai harus diisi')
      return false
    }

    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    if (startDate > endDate) {
      setError('Tanggal mulai tidak boleh lebih besar dari tanggal selesai')
      return false
    }

    // Validasi selisih tanggal (maksimal 30 hari)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 30) {
      setError('Rentang tanggal maksimal 30 hari')
      return false
    }

    // Validasi kapasitas
    const officeCapacity = parseInt(formData.office_capacity)
    if (isNaN(officeCapacity) || officeCapacity <= 0) {
      setError('Kapasitas kantor harus berupa angka positif')
      return false
    }

    // Validasi WFO per minggu
    const minWFO = parseInt(formData.min_wfo_per_week)
    const maxWFO = parseInt(formData.max_wfo_per_week)
    
    if (isNaN(minWFO) || minWFO < 0 || minWFO > 7) {
      setError('Min WFO per minggu harus antara 0-7')
      return false
    }

    if (isNaN(maxWFO) || maxWFO <= 0 || maxWFO > 7) {
      setError('Max WFO per minggu harus antara 1-7')
      return false
    }

    if (minWFO > maxWFO) {
      setError('Min WFO tidak boleh lebih besar dari Max WFO')
      return false
    }

    // Validasi parameter algoritma (jika ditampilkan)
    if (showAdvanced) {
      const populationSize = parseInt(formData.population_size)
      const generations = parseInt(formData.generations)
      const mutationRate = parseFloat(formData.mutation_rate)
      
      if (populationSize < 10 || populationSize > 500) {
        setError('Population Size harus antara 10-500')
        return false
      }
      
      if (generations < 10 || generations > 1000) {
        setError('Generations harus antara 10-1000')
        return false
      }
      
      if (mutationRate < 0 || mutationRate > 100) {
        setError('Mutation Rate harus antara 0-100%')
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setError(null)

      const token = getAuthToken()
      if (!token) {
        setError('Anda harus login terlebih dahulu')
        setIsSubmitting(false)
        return
      }

      // Prepare data untuk API
      const scheduleData: GenerateScheduleRequest = {
        start_date: formData.start_date,
        end_date: formData.end_date,
        office_capacity: parseInt(formData.office_capacity),
        min_wfo_per_week: parseInt(formData.min_wfo_per_week),
        max_wfo_per_week: parseInt(formData.max_wfo_per_week),
        ...(formData.office_location_id && { office_location_id: formData.office_location_id }),
        ...(showAdvanced && {
          population_size: parseInt(formData.population_size),
          generations: parseInt(formData.generations),
          mutation_rate: parseFloat(formData.mutation_rate)
        })
      }

      console.log('Submitting schedule data:', scheduleData)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/generate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scheduleData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`)
      }

      const result: GenerateScheduleResponse = await response.json()
      
      console.log('Schedule generated successfully:', result)

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      // Close modal
      onClose()

      // Show success message
      alert(
        `✅ Jadwal berhasil di-generate!\n\n` +
        `📅 Periode: ${new Date(result.start_date).toLocaleDateString('id-ID')} - ${new Date(result.end_date).toLocaleDateString('id-ID')}\n` +
        `📋 Total Jadwal: ${result.total_schedules}\n` +
        `👥 Karyawan Terpengaruh: ${result.affected_employees}`
      )
      
    } catch (err) {
      console.error('Generate schedule error:', err)
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Terjadi kesalahan tidak terduga saat menghubungi server'
      
      // Berikan pesan error yang lebih spesifik
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.')
      } else if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        setError('Anda tidak memiliki izin untuk melakukan operasi ini.')
      } else if (errorMessage.includes('404')) {
        setError('Endpoint API tidak ditemukan.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fungsi untuk menghitung hari kerja
  const calculateWorkingDays = () => {
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 untuk include start date
    
    // Perkiraan hari kerja (Senin-Jumat)
    const totalDays = diffDays
    const weeks = Math.floor(totalDays / 7)
    const remainingDays = totalDays % 7
    
    let workingDays = weeks * 5
    for (let i = 0; i < remainingDays; i++) {
      const day = (startDate.getDay() + i) % 7
      if (day >= 1 && day <= 5) { // Senin(1) - Jumat(5)
        workingDays++
      }
    }
    
    return { totalDays, workingDays }
  }

  const { totalDays, workingDays } = calculateWorkingDays()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={isSubmitting ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                      Generate Jadwal Kerja Otomatis
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Sistem akan mengoptimalkan distribusi WFO/WFH menggunakan Algoritma Genetika
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <InformationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Konfigurasi Penjadwalan */}
                  <div>
                    <div className="flex items-center mb-4">
                      <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="text-lg font-medium text-gray-900">Konfigurasi Penjadwalan</h4>
                    </div>
                    
                    {/* Info Summary */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Periode:</span>
                          <p className="font-medium text-gray-900">
                            {new Date(formData.start_date).toLocaleDateString('id-ID')} - {new Date(formData.end_date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Hari:</span>
                          <p className="font-medium text-gray-900">{totalDays} hari ({workingDays} hari kerja)</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Kapasitas:</span>
                          <p className="font-medium text-gray-900">{formData.office_capacity} orang/hari</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tanggal Mulai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Mulai *
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Mulai periode penjadwalan
                        </p>
                      </div>

                      {/* Tanggal Selesai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Selesai *
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          min={formData.start_date}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Akhir periode penjadwalan (maks 30 hari)
                        </p>
                      </div>

                      {/* Kapasitas Kantor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kapasitas Kantor (orang/hari) *
                        </label>
                        <input
                          type="number"
                          name="office_capacity"
                          value={formData.office_capacity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          placeholder="50"
                          min="1"
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maksimal orang yang dapat WFO per hari
                        </p>
                      </div>

                      {/* Lokasi Kantor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi Kantor
                        </label>
                        <select
                          name="office_location_id"
                          value={formData.office_location_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          disabled={isSubmitting || officeLocations.length === 0}
                        >
                          <option value="">Pilih Lokasi (Opsional)</option>
                          {officeLocations.map(location => (
                            <option key={location.id} value={location.id}>
                              {location.name} (Kap: {location.capacity})
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          {officeLocations.length === 0 
                            ? "Belum ada lokasi terdaftar" 
                            : "Pilih lokasi kantor utama untuk penjadwalan"}
                        </p>
                      </div>

                      {/* Min WFO per Minggu */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min WFO per Minggu *
                        </label>
                        <input
                          type="number"
                          name="min_wfo_per_week"
                          value={formData.min_wfo_per_week}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          placeholder="2"
                          min="0"
                          max="7"
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Minimal hari WFO per karyawan per minggu (0-7)
                        </p>
                      </div>

                      {/* Max WFO per Minggu */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max WFO per Minggu *
                        </label>
                        <input
                          type="number"
                          name="max_wfo_per_week"
                          value={formData.max_wfo_per_week}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                          placeholder="5"
                          min="1"
                          max="7"
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maksimal hari WFO per karyawan per minggu (1-7)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Advanced Settings */}
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <CpuChipIcon className="h-5 w-5 mr-2" />
                      {showAdvanced ? 'Sembunyikan' : 'Tampilkan'} Parameter Algoritma Lanjutan
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Opsional
                      </span>
                    </button>
                  </div>

                  {/* Parameter Algoritma Genetika (Conditional) */}
                  {showAdvanced && (
                    <div>
                      <div className="flex items-center mb-4">
                        <CpuChipIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="text-lg font-medium text-gray-900">Parameter Algoritma Genetika</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Population Size */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Population Size
                          </label>
                          <input
                            type="number"
                            name="population_size"
                            value={formData.population_size}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                            placeholder="50"
                            min="10"
                            max="500"
                            disabled={isSubmitting}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Ukuran populasi (10-500)
                          </p>
                        </div>

                        {/* Generations */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generations
                          </label>
                          <input
                            type="number"
                            name="generations"
                            value={formData.generations}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                            placeholder="100"
                            min="10"
                            max="1000"
                            disabled={isSubmitting}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Jumlah generasi (10-1000)
                          </p>
                        </div>

                        {/* Mutation Rate */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mutation Rate
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              name="mutation_rate"
                              value={formData.mutation_rate}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50 pr-12"
                              placeholder="10"
                              min="0"
                              max="100"
                              step="0.1"
                              disabled={isSubmitting}
                            />
                            <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Tingkat mutasi (0-100%)
                          </p>
                        </div>
                      </div>
                      
                      {/* Info Box */}
                      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-5 w-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Tips:</span> Parameter default sudah dioptimalkan. 
                              Gunakan pengaturan lanjutan hanya jika Anda memahami algoritma genetika.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informasi Algoritma */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Tentang Algoritma Genetika</h5>
                        <p className="text-sm text-gray-700">
                          Sistem akan mengoptimalkan jadwal dengan mempertimbangkan:
                        </p>
                        <ul className="text-sm text-gray-700 mt-2 space-y-1">
                          <li>• Kapasitas kantor yang tersedia setiap hari</li>
                          <li>• Batasan WFO per minggu per karyawan</li>
                          <li>• Distribusi yang adil antar karyawan</li>
                          <li>• Prioritas kebutuhan bisnis</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-2">
                          Proses ini memakan waktu beberapa detik tergantung jumlah karyawan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading Indicator */}
                {isSubmitting && (
                  <div className="flex items-center justify-center my-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-sm text-gray-600">
                      Sedang meng-generate jadwal...
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-8 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Memproses...' : 'Generate Jadwal'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}