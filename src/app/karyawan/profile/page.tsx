"use client";

import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ProfileCard from "@/components/karyawan/ProfileCard";
import ProfileSection from "@/components/karyawan/ProfileSection";
import EditProfileModal from "@/components/karyawan/EditProfileModal";
import { Profile } from "@/types/profile";

const initialProfile: Profile = {
  namaDepan: "Bais",
  namaBelakang: "Yufan",
  email: "baisyufan@gmail.com",
  role: "Web Developer",
  jenisKelamin: "Laki-laki",
  tanggalLahir: "2004-11-26",
  divisi: "IT",
  alamat: {
    namaAlamat: "Apartemen",
    alamatLengkap:
      "Jl. Sukangara No.31, Antapani Kidul, Kec. Antapani, Kota Bandung",
    detail: "Depan ada warung",
  },
  kontakDarurat: {
    nama: "Dakna",
    hubungan: "Teman",
    telepon: "08123456789",
  },
  rekening: {
    bank: "BCA",
    nomor: "123456789101",
    pemilik: "M Bais Yufan Mardiannsah",
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Profile</h1>
        <button
          onClick={() => setOpenEdit(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <PencilSquareIcon className="w-4 h-4" />
          Edit
        </button>
      </div>

      <ProfileCard profile={profile} />

      <ProfileSection title="Data Diri" items={[
        ["Nama Depan", profile.namaDepan],
        ["Nama Belakang", profile.namaBelakang],
        ["Jenis Kelamin", profile.jenisKelamin],
        ["Tanggal Lahir", profile.tanggalLahir],
        ["Email", profile.email],
        ["Divisi", profile.divisi],
      ]} />

      <ProfileSection title="Alamat" items={[
        ["Nama Alamat", profile.alamat.namaAlamat],
        ["Alamat Lengkap", profile.alamat.alamatLengkap],
        ["Detail", profile.alamat.detail],
      ]} />

      <ProfileSection title="Kontak Darurat" items={[
        ["Nama", profile.kontakDarurat.nama],
        ["Hubungan", profile.kontakDarurat.hubungan],
        ["Telepon", profile.kontakDarurat.telepon],
      ]} />

      <ProfileSection title="Data Rekening Bank" items={[
        ["Nama Bank", profile.rekening.bank],
        ["Nomor Rekening", profile.rekening.nomor],
        ["Nama Pemilik", profile.rekening.pemilik],
      ]} />

      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        profile={profile}
        onSave={setProfile}
      />
    </div>
  );
}
