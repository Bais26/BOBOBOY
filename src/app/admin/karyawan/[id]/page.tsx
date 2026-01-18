'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter, useParams } from 'next/navigation';

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

        // ambil token
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Token tidak ditemukan');

        // tentukan karyawan_id
        const karyawanId = params?.id || localStorage.getItem('user_id');
        if (!karyawanId) throw new Error('Karyawan ID tidak ditemukan');

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/${karyawanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // mapping API ke type KaryawanProfile
        const data: KaryawanProfile = {
          id: res.data.id || karyawanId,
          nama: res.data.full_name,
          email: res.data.email || '-',
          jabatan: res.data.posisi || '-',
          statusKaryawan: res.data.karyawan_detail.status_karyawan || '-',
          masukKantor: res.data.karyawan_detail.tanggal_masuk || '-',
          status: res.data.karyawan_detail.status || '-',

          namaDepan: res.data.karyawan_detail.nama_depan || '-',
          namaBelakang: res.data.karyawan_detail.nama_belakang || '-',
          tanggalLahir: res.data.karyawan_detail.tanggal_lahir || '-',
          jenisKelamin: res.data.karyawan_detail.jenis_kelamin || '-',
          tinggiBadan: res.data.karyawan_detail.tinggi_badan || '-',
          beratBadan: res.data.karyawan_detail.berat_badan || '-',

          namaAlamat: res.data.karyawan_detail.nama_alamat || '-',
          pinLokasi: res.data.karyawan_detail.pin_lokasi || { lat: 0, lng: 0 },
          namaJalan: res.data.karyawan_detail.alamat_lengkap || '-',
          detailAlamat: res.data.karyawan_detail.detail_alamat || '-',

          kontakDarurat: {
            nama: res.data.karyawan_detail.nama_kontak_darurat || '-',
            hubungan: res.data.karyawan_detail.hubungan_kontak_darurat || '-',
            nomorTelepon: res.data.karyawan_detail.nomor_telepon_darurat || '-',
          },

          rekening: {
            namaBank: res.data.karyawan_detail.nama_bank || '-',
            namaRekening: res.data.karyawan_detail.nama_rekening || '-',
            nomorRekening: res.data.karyawan_detail.nomor_rekening || '-',
            namaPemilikRekening: res.data.karyawan_detail.nama_pemilik_rekening || '-',
          },
        };

        setProfile(data);
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.message || 'Gagal memuat data karyawan',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!profile) return <div className="text-center py-20">Profile tidak ditemukan</div>;

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
