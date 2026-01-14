'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, deleteAllAuthCookies } from '@/lib/cookies';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  HomeIcon, 
  PhoneIcon, 
  BanknotesIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface KaryawanData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  is_active: boolean;
  created_at: string;
}

interface KaryawanDetail {
  nama_depan: string;
  nama_belakang: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  tinggi_badan: string;
  berat_badan: string;
  nama_alamat: string;
  alamat_lengkap: string;
  detail_alamat: string;
  nama_kontak_darurat: string;
  hubungan_kontak_darurat: string;
  nomor_telepon_darurat: string;
  nama_bank: string;
  nomor_rekening: string;
  nama_pemilik_rekening: string;
  posisi: string;
  tanggal_masuk: string;
  status: string;
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const [karyawanData, setKaryawanData] = useState<KaryawanData | null>(null);
  const [karyawanDetail, setKaryawanDetail] = useState<KaryawanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState<KaryawanDetail | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchKaryawanData();
  }, []);

  const getAuthHeaders = () => {
    const token = getCookie('access_token');
    if (!token) {
      router.push('/login');
      throw new Error('Token tidak ditemukan');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const getUserId = () => {
    const userId = getCookie('user_id');
    if (!userId) {
      router.push('/login');
      throw new Error('User ID tidak ditemukan');
    }
    return userId;
  };

  const fetchKaryawanData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      const headers = getAuthHeaders();
      
      // Fetch data karyawan
      const responseKaryawan = await fetch(
        `https://be-abcenci.vercel.app/api/v1/karyawan/${userId}`,
        { headers }
      );

      if (!responseKaryawan.ok) {
        if (responseKaryawan.status === 401) {
          deleteAllAuthCookies();
          router.push('/login');
          return;
        }
        throw new Error('Gagal mengambil data karyawan');
      }

      const resultKaryawan = await responseKaryawan.json();
      
      if (resultKaryawan.data) {
        setKaryawanData(resultKaryawan.data);
        
        // Jika bukan admin, fetch detail karyawan
        if (resultKaryawan.data.role !== 'admin') {
          const responseDetail = await fetch(
            `https://be-abcenci.vercel.app/api/v1/karyawan/${userId}/detail`,
            { headers }
          );

          if (!responseDetail.ok) {
            throw new Error('Gagal mengambil detail karyawan');
          }

          const resultDetail = await responseDetail.json();
          
          if (resultDetail.data) {
            setKaryawanDetail(resultDetail.data);
            setEditedDetail(resultDetail.data);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetail(karyawanDetail);
  };

  const handleSave = async () => {
    if (!editedDetail) return;

    try {
      setIsSaving(true);
      const userId = getUserId();
      const headers = getAuthHeaders();

      const response = await fetch(
        `https://be-abcenci.vercel.app/api/karyawan/karyawan/${userId}/detail`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(editedDetail),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          deleteAllAuthCookies();
          router.push('/login');
          return;
        }
        throw new Error('Gagal mengupdate data');
      }

      const result = await response.json();
      setKaryawanDetail(result.data);
      setIsEditing(false);
      alert('Data berhasil diupdate!');
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof KaryawanDetail, value: string) => {
    if (editedDetail) {
      setEditedDetail({
        ...editedDetail,
        [field]: value,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchKaryawanData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!karyawanData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Data tidak ditemukan</p>
      </div>
    );
  }

  const isAdmin = karyawanData.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header dengan tombol back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Card Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Profile */}
          <div className="bg-white border-b border-gray-200 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {karyawanDetail?.posisi || karyawanData.role.toUpperCase()}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">{karyawanData.full_name}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">{karyawanData.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {isAdmin ? 'MASUK EDITOR' : 'STATUS'}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {isAdmin ? formatDate(karyawanData.created_at) : karyawanDetail?.status || 'Aktif'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isAdmin ? (
              // Tampilan untuk Admin (hanya nama dan email)
              <div className="space-y-6">
                <InfoSection title="Profil" icon={<UserIcon className="w-5 h-5" />}>
                  <div className="grid grid-cols-1 gap-4">
                    <DisplayField label="Nama Lengkap" value={karyawanData.full_name} />
                    <DisplayField label="Email" value={karyawanData.email} />
                  </div>
                </InfoSection>
              </div>
            ) : (
              // Tampilan untuk Karyawan (lengkap dengan edit)
              <>
                {/* Tombol Edit/Save/Cancel */}
                <div className="flex justify-end mb-6 gap-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckIcon className="w-4 h-4" />
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Data Diri */}
                  <InfoSection title="Data Diri" icon={<UserIcon className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <EditableField
                        label="Nama Depan"
                        value={editedDetail?.nama_depan || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_depan', val)}
                      />
                      <EditableField
                        label="Nama Belakang"
                        value={editedDetail?.nama_belakang || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_belakang', val)}
                      />
                      <EditableField
                        label="Tanggal Lahir"
                        value={editedDetail?.tanggal_lahir || ''}
                        isEditing={isEditing}
                        type="date"
                        onChange={(val) => handleInputChange('tanggal_lahir', val)}
                      />
                      <EditableField
                        label="Jenis Kelamin"
                        value={editedDetail?.jenis_kelamin || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('jenis_kelamin', val)}
                      />
                      <EditableField
                        label="Tinggi Badan"
                        value={editedDetail?.tinggi_badan || ''}
                        isEditing={isEditing}
                        suffix="cm"
                        onChange={(val) => handleInputChange('tinggi_badan', val)}
                      />
                      <EditableField
                        label="Berat Badan"
                        value={editedDetail?.berat_badan || ''}
                        isEditing={isEditing}
                        suffix="kg"
                        onChange={(val) => handleInputChange('berat_badan', val)}
                      />
                    </div>
                  </InfoSection>

                  {/* Alamat */}
                  <InfoSection title="Alamat" icon={<HomeIcon className="w-5 h-5" />}>
                    <div className="space-y-4">
                      <EditableField
                        label="Nama Alamat"
                        value={editedDetail?.nama_alamat || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_alamat', val)}
                      />
                      <EditableField
                        label="Nama Jalan, Kecamatan, Kota"
                        value={editedDetail?.alamat_lengkap || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('alamat_lengkap', val)}
                      />
                      <EditableField
                        label="Detail Alamat"
                        value={editedDetail?.detail_alamat || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('detail_alamat', val)}
                      />
                    </div>
                  </InfoSection>

                  {/* Kontak Darurat */}
                  <InfoSection title="Kontak Darurat" icon={<PhoneIcon className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <EditableField
                        label="Nama"
                        value={editedDetail?.nama_kontak_darurat || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_kontak_darurat', val)}
                      />
                      <EditableField
                        label="Hubungan"
                        value={editedDetail?.hubungan_kontak_darurat || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('hubungan_kontak_darurat', val)}
                      />
                      <EditableField
                        label="Nomor Telepon"
                        value={editedDetail?.nomor_telepon_darurat || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nomor_telepon_darurat', val)}
                      />
                    </div>
                  </InfoSection>

                  {/* Data Rekening Bank */}
                  <InfoSection title="Data Rekening Bank" icon={<BanknotesIcon className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <EditableField
                        label="Nama Bank"
                        value={editedDetail?.nama_bank || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_bank', val)}
                      />
                      <EditableField
                        label="Nomor Rekening"
                        value={editedDetail?.nomor_rekening || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nomor_rekening', val)}
                      />
                      <EditableField
                        label="Nama Pemilik Rekening"
                        value={editedDetail?.nama_pemilik_rekening || ''}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('nama_pemilik_rekening', val)}
                      />
                    </div>
                  </InfoSection>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component untuk section dengan icon
function InfoSection({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-600">{icon}</div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Component untuk field yang bisa diedit
function EditableField({
  label,
  value,
  isEditing,
  type = 'text',
  suffix,
  onChange,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  type?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      {isEditing ? (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {suffix}
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium text-gray-900">
          {value || '-'} {suffix && value ? suffix : ''}
        </p>
      )}
    </div>
  );
}

// Component untuk field display only
function DisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}