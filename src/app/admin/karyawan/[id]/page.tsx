'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

import ProfileHeader from '@/components/shared/ProfileHeader';
import DataDiriSection from '@/components/karyawan/DataDiriSection';
import AlamatSection from '@/components/karyawan/AlamatSection';
import KontakDaruratSection from '@/components/karyawan/KontakDaruratSection';
import RekeningBankSection from '@/components/karyawan/RekeningBankSection';
import { KaryawanProfile } from '@/types/profil';

export default function ProfilKaryawanPage() {
  const router = useRouter();
  const params = useParams(); // untuk admin lihat detail karyawan
  const [profile, setProfile] = useState<KaryawanProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Tentukan karyawan_id
        // Jika ada params.id, gunakan itu (untuk admin view)
        // Jika tidak, ambil dari localStorage (untuk karyawan view own profile)
        const karyawanId = params?.id || localStorage.getItem('user_id');
        if (!karyawanId) {
          throw new Error('Karyawan ID tidak ditemukan');
        }

        // Fetch using axios instance from lib/api.ts
        // Token akan otomatis ditambahkan oleh interceptor
        const res = await api.get(`/v1/karyawan/${karyawanId}`);

        // Mapping API ke type KaryawanProfile
        const data: KaryawanProfile = {
          id: res.data.id || karyawanId,
          nama: res.data.full_name,
          email: res.data.email || '-',
          jabatan: res.data.posisi || '-',
          statusKaryawan: res.data.karyawan_detail?.status_karyawan || '-',
          masukKantor: res.data.karyawan_detail?.tanggal_masuk || '-',
          status: res.data.karyawan_detail?.status || '-',

          namaDepan: res.data.karyawan_detail?.nama_depan || '-',
          namaBelakang: res.data.karyawan_detail?.nama_belakang || '-',
          tanggalLahir: res.data.karyawan_detail?.tanggal_lahir || '-',
          jenisKelamin: res.data.karyawan_detail?.jenis_kelamin || '-',
          tinggiBadan: res.data.karyawan_detail?.tinggi_badan || '-',
          beratBadan: res.data.karyawan_detail?.berat_badan || '-',

          namaAlamat: res.data.karyawan_detail?.nama_alamat || '-',
          pinLokasi: res.data.karyawan_detail?.pin_lokasi || { lat: 0, lng: 0 },
          namaJalan: res.data.karyawan_detail?.alamat_lengkap || '-',
          detailAlamat: res.data.karyawan_detail?.detail_alamat || '-',

          kontakDarurat: {
            nama: res.data.karyawan_detail?.nama_kontak_darurat || '-',
            hubungan: res.data.karyawan_detail?.hubungan_kontak_darurat || '-',
            nomorTelepon: res.data.karyawan_detail?.nomor_telepon_darurat || '-',
          },

          rekening: {
            namaBank: res.data.karyawan_detail?.nama_bank || '-',
            namaRekening: res.data.karyawan_detail?.nama_rekening || '-',
            nomorRekening: res.data.karyawan_detail?.nomor_rekening || '-',
            namaPemilikRekening: res.data.karyawan_detail?.nama_pemilik_rekening || '-',
          },
        };

        setProfile(data);
      } catch (err: any) {
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.response?.data?.message || err.message || 'Gagal memuat data karyawan',
        });

        // Jika unauthorized, redirect ke login
        if (err.response?.status === 401) {
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data karyawan...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-red-900 mb-2">Profile tidak ditemukan</h3>
          <p className="text-sm text-red-700">Data karyawan tidak dapat dimuat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        nama={profile.nama}
        email={profile.email}
        jabatan={profile.jabatan}
        masukKantor={profile.masukKantor}
        status={profile.status}
      />

      {/* Data Diri */}
      <DataDiriSection
        namaDepan={profile.namaDepan}
        namaBelakang={profile.namaBelakang}
        tanggalLahir={profile.tanggalLahir}
        jenisKelamin={profile.jenisKelamin}
        tinggiBadan={profile.tinggiBadan}
        beratBadan={profile.beratBadan}
      />

      {/* Alamat */}
      <AlamatSection
        namaAlamat={profile.namaAlamat}
        namaJalan={profile.namaJalan}
        detailAlamat={profile.detailAlamat}
      />

      {/* Kontak Darurat */}
      <KontakDaruratSection
        nama={profile.kontakDarurat.nama}
        hubungan={profile.kontakDarurat.hubungan}
        nomorTelepon={profile.kontakDarurat.nomorTelepon}
      />

      {/* Rekening Bank */}
      <RekeningBankSection
        namaBank={profile.rekening.namaBank}
        namaRekening={profile.rekening.namaRekening}
        nomorRekening={profile.rekening.nomorRekening}
        namaPemilikRekening={profile.rekening.namaPemilikRekening}
      />
    </div>
  );
}