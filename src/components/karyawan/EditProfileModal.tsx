"use client";

import { useState, useEffect } from "react";

export default function EditProfileModal({
  open,
  onClose,
  profile,
  onSave,
}: any) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <h2 className="text-lg font-semibold">Edit Profile</h2>

        {/* ================= DATA DIRI ================= */}
        <Section title="Data Diri">
          <Input
            label="Nama Depan"
            value={form.namaDepan}
            onChange={(value: string) => setForm({ ...form, namaDepan: value })}
          />
          <Input
            label="Nama Belakang"
            value={form.namaBelakang}
            onChange={(value: string) => setForm({ ...form, namaBelakang: value })}
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(value: string) => setForm({ ...form, email: value })}
            className="col-span-2"
          />
          <Input
            label="Jenis Kelamin"
            value={form.jenisKelamin}
            onChange={(value: string) => setForm({ ...form, jenisKelamin: value })}
          />
          <Input
            label="Tanggal Lahir"
            type="date"
            value={form.tanggalLahir}
            onChange={(value: string) => setForm({ ...form, tanggalLahir: value })}
          />
          <Input
            label="Divisi"
            value={form.divisi}
            disabled
            onChange={(value: string) => setForm({ ...form, divisi: value })}
          />
        </Section>

        {/* ================= ALAMAT ================= */}
        <Section title="Alamat">
          <Input
            label="Nama Alamat"
            value={form.alamat.namaAlamat}
            onChange={(value: string) =>
              setForm({
                ...form,
                alamat: { ...form.alamat, namaAlamat: value },
              })
            }
          />
          <Input
            label="Alamat Lengkap"
            value={form.alamat.alamatLengkap}
            onChange={(value: string) =>
              setForm({
                ...form,
                alamat: { ...form.alamat, alamatLengkap: value },
              })
            }
            className="col-span-2"
          />
          <Input
            label="Detail Alamat"
            value={form.alamat.detail}
            onChange={(value: string) =>
              setForm({
                ...form,
                alamat: { ...form.alamat, detail: value },
              })
            }
            className="col-span-2"
          />
        </Section>

        {/* ================= KONTAK DARURAT ================= */}
        <Section title="Kontak Darurat">
          <Input
            label="Nama"
            value={form.kontakDarurat.nama}
            onChange={(value: string) =>
              setForm({
                ...form,
                kontakDarurat: { ...form.kontakDarurat, nama: value },
              })
            }
          />
          <Input
            label="Hubungan"
            value={form.kontakDarurat.hubungan}
            onChange={(value: string) =>
              setForm({
                ...form,
                kontakDarurat: { ...form.kontakDarurat, hubungan: value },
              })
            }
          />
          <Input
            label="Nomor Telepon"
            value={form.kontakDarurat.telepon}
            onChange={(value: string) =>
              setForm({
                ...form,
                kontakDarurat: { ...form.kontakDarurat, telepon: value },
              })
            }
          />
        </Section>

        <Section title="Data Rekening Bank">
          <Input label="Nama Bank" value={form.rekening.bank} disabled />
          <Input label="Nomor Rekening" value={form.rekening.nomor} disabled />
          <Input
            label="Nama Pemilik"
            value={form.rekening.pemilik}
            disabled
            className="col-span-2"
          />
          <p className="text-xs text-gray-500 col-span-2">
            * Data rekening tidak dapat diubah. Hubungi admin HR jika terjadi
            kesalahan.
          </p>
        </Section>

        {/* ================= ACTION ================= */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  className = "",
}: any) {
  return (
    <div className={className}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm 
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
