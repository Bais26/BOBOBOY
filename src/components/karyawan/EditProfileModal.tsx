"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function EditProfileModal({ open, onClose, profile, onSave }: any) {
  const [form, setForm] = useState(profile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile, open]);

  if (!open) return null;

  const handleSave = async () => {
    // Konfirmasi dulu
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Perubahan profile akan disimpan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const userId = localStorage.getItem("user_id");
    if (!userId)
      return Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "User ID tidak ditemukan di localStorage",
      });

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/${userId}/detail`,
        {
          nama_depan: form.namaDepan,
          nama_belakang: form.namaBelakang,
          jenis_kelamin: form.jenisKelamin,
          tanggal_lahir: form.tanggalLahir,
          nama_alamat: form.alamat.namaAlamat,
          alamat_lengkap: form.alamat.alamatLengkap,
          detail_alamat: form.alamat.detail,
          nama_kontak_darurat: form.kontakDarurat.nama,
          hubungan_kontak_darurat: form.kontakDarurat.hubungan,
          nomor_telepon_darurat: form.kontakDarurat.telepon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profile berhasil diperbarui!",
        timer: 2000,
        showConfirmButton: false,
      });

      onSave(res.data);
      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.detail || err.message || "Terjadi kesalahan",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <h2 className="text-lg font-semibold">Edit Profile</h2>

        {/* ================= DATA DIRI ================= */}
        <Section title="Data Diri">
          <Input label="Nama Depan" value={form.namaDepan} onChange={(v: string) => setForm({ ...form, namaDepan: v })} />
          <Input label="Nama Belakang" value={form.namaBelakang} onChange={(v: string) => setForm({ ...form, namaBelakang: v })} />
          <Input label="Email" value={form.email} disabled />
          <Select
            label="Jenis Kelamin"
            value={form.jenisKelamin}
            onChange={(v: string) => setForm({ ...form, jenisKelamin: v })}
            options={["Laki-laki", "Perempuan"]}
          />
          <Input label="Tanggal Lahir" type="date" value={form.tanggalLahir} onChange={(v: string) => setForm({ ...form, tanggalLahir: v })} />
          <Input label="Divisi" value={form.divisi || "-"} disabled />
        </Section>

        {/* ================= ALAMAT ================= */}
        <Section title="Alamat">
          <Input label="Nama Alamat" value={form.alamat.namaAlamat} onChange={(v: string) => setForm({ ...form, alamat: { ...form.alamat, namaAlamat: v } })} />
          <Input label="Alamat Lengkap" value={form.alamat.alamatLengkap} onChange={(v: string) => setForm({ ...form, alamat: { ...form.alamat, alamatLengkap: v } })} />
          <Input label="Detail Alamat" value={form.alamat.detail} onChange={(v: string) => setForm({ ...form, alamat: { ...form.alamat, detail: v } })} />
        </Section>

        {/* ================= KONTAK DARURAT ================= */}
        <Section title="Kontak Darurat">
          <Input label="Nama" value={form.kontakDarurat.nama} onChange={(v: string) => setForm({ ...form, kontakDarurat: { ...form.kontakDarurat, nama: v } })} />
          <Input label="Hubungan" value={form.kontakDarurat.hubungan} onChange={(v: string) => setForm({ ...form, kontakDarurat: { ...form.kontakDarurat, hubungan: v } })} />
          <Input label="Nomor Telepon" value={form.kontakDarurat.telepon} onChange={(v: string) => setForm({ ...form, kontakDarurat: { ...form.kontakDarurat, telepon: v } })} />
        </Section>

        {/* ================= DATA REKENING ================= */}
        <Section title="Data Rekening Bank">
          <Input label="Nama Bank" value={form.rekening.bank} disabled />
          <Input label="Nomor Rekening" value={form.rekening.nomor} disabled />
          <Input label="Nama Pemilik" value={form.rekening.pemilik} disabled />
          <p className="text-xs text-gray-500 col-span-2">
            * Data rekening tidak dapat diubah. Hubungi admin HR jika terjadi kesalahan.
          </p>
        </Section>

        {/* ================= ACTION ================= */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border" disabled={submitting}>
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, disabled = false, type = "text", className = "" }: any) {
  return (
    <div className={className}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
      >
        <option value="">-</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
