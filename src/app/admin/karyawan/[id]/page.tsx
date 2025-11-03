'use client';
import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import ProfileHeader from '@/components/shared/ProfileHeader';
import DataDiriSection from '@/components/karyawan/DataDiriSection';
import AlamatSection from '@/components/karyawan/AlamatSection';
import KontakDaruratSection from '@/components/karyawan/KontakDaruratSection';
import RekeningBankSection from '@/components/karyawan/RekeningBankSection';
import { KaryawanProfile } from '@/types/profil';

// Mock data
const mockProfile: KaryawanProfile = {
  id: 'CBN234',
  nama: 'Bais Yufan',
  email: 'Baisyufan2004@gmail.com',
  jabatan: 'WEB DEVELOPER',
  statusKaryawan: 'Kontrak',
  masukKantor: '24/09/2024',
  status: 'Aktif',
  
  namaDepan: 'Bais',
  namaBelakang: 'Yufan',
  tanggalLahir: '28 November 2004',
  jenisKelamin: 'Laki-laki',
  tinggiBadan: '179cm',
  beratBadan: '62kg',
  
  namaAlamat: 'Apartemen',
  pinLokasi: {
    lat: -6.914744,
    lng: 107.609810,
  },
  namaJalan: 'Jl. Sukaragara No.31, Antapani Kidul, Kec. Antapani, Kota Bandung',
  detailAlamat: 'Depan ada Warung',
  
  kontakDarurat: {
    nama: 'Dakna',
    hubungan: 'Teman',
    nomorTelepon: '08123456789',
  },
  
  rekening: {
    namaBank: 'BCA',
    namaRekening: '1234567891101',
    nomorRekening: '1234567891101',
    namaPemilikRekening: 'M Bais Yufan Mardlansah',
  },
};

export default function ProfilKaryawanPage() {
  const [profile] = useState<KaryawanProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);

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