"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ProfileCard from "@/components/karyawan/ProfileCard";
import ProfileSection from "@/components/karyawan/ProfileSection";
import EditProfileModal from "@/components/karyawan/EditProfileModal";
import { Profile } from "@/types/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token not found. Please login.");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();

        const mappedProfile: Profile = {
          full_name: data.full_name,
          namaDepan: data.karyawan_detail?.nama_depan || "-",
          namaBelakang: data.karyawan_detail?.nama_belakang || "-",
          email: data.email || "-",
          role: data.role || "-",
          jenisKelamin: data.karyawan_detail?.jenis_kelamin || "-",
          tanggalLahir: data.karyawan_detail?.tanggal_lahir || "-",
          divisi: data.karyawan_detail?.posisi || "-",
          alamat: {
            namaAlamat: data.karyawan_detail?.nama_alamat || "-",
            alamatLengkap: data.karyawan_detail?.alamat_lengkap || "-",
            detail: data.karyawan_detail?.detail_alamat || "-",
          },
          kontakDarurat: {
            nama: data.karyawan_detail?.nama_kontak_darurat || "-",
            hubungan: data.karyawan_detail?.hubungan_kontak_darurat || "-",
            telepon: data.karyawan_detail?.nomor_telepon_darurat || "-",
          },
          rekening: {
            bank: data.karyawan_detail?.nama_bank || "-",
            nomor: data.karyawan_detail?.nomor_rekening || "-",
            pemilik: data.karyawan_detail?.nama_pemilik_rekening || "-",
          },
        };

        setProfile(mappedProfile);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-20">
        Profile not found
      </div>
    );

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

      <ProfileSection
        title="Data Diri"
        items={[
          ["Nama Depan", profile.namaDepan],
          ["Nama Belakang", profile.namaBelakang],
          ["Jenis Kelamin", profile.jenisKelamin],
          ["Tanggal Lahir", profile.tanggalLahir],
          ["Email", profile.email],
          ["Divisi", profile.divisi],
        ]}
      />

      <ProfileSection
        title="Alamat"
        items={[
          ["Nama Alamat", profile.alamat.namaAlamat],
          ["Alamat Lengkap", profile.alamat.alamatLengkap],
          ["Detail", profile.alamat.detail],
        ]}
      />

      <ProfileSection
        title="Kontak Darurat"
        items={[
          ["Nama", profile.kontakDarurat.nama],
          ["Hubungan", profile.kontakDarurat.hubungan],
          ["Telepon", profile.kontakDarurat.telepon],
        ]}
      />

      <ProfileSection
        title="Data Rekening Bank"
        items={[
          ["Nama Bank", profile.rekening.bank],
          ["Nomor Rekening", profile.rekening.nomor],
          ["Nama Pemilik", profile.rekening.pemilik],
        ]}
      />

      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        profile={profile}
        onSave={setProfile}
      />
    </div>
  );
}
