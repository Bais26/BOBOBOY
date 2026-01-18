'use client';
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";

import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";

interface FormData {
  id: string;
  fullName: string;
  email: string;
  jabatan: string;
  status: string;
  namaDepan: string;
  namaBelakang: string;
  tanggalLahir: string;
  jenisKelamin: string;
  tinggiBadan: string;
  beratBadan: string;
  namaAlamat: string;
  namaJalan: string;
  detailAlamat: string;
  kontakNama: string;
  kontakHubungan: string;
  kontakTelepon: string;
  namaBank: string;
  nomorRekening: string;
  namaPemilikRekening: string;
}

interface InputProps {
  label: string;
  value: string;
  name: string; // ⚠ required
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}


const jabatanOptions = [
  { label: "Web Developer", value: "WEB DEVELOPER" },
  { label: "Mobile Developer", value: "MOBILE DEVELOPER" },
  { label: "UI/UX Designer", value: "UI/UX DESIGNER" },
  { label: "Project Manager", value: "PROJECT MANAGER" },
  { label: "Business Analyst", value: "BUSINESS ANALYST" },
];

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Nonaktif", value: "Nonaktif" },
];

const jenisKelaminOptions = [
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
];

export default function EditKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const karyawanId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    fullName: "",
    email: "",
    jabatan: "",
    status: "",
    namaDepan: "",
    namaBelakang: "",
    tanggalLahir: "",
    jenisKelamin: "",
    tinggiBadan: "",
    beratBadan: "",
    namaAlamat: "",
    namaJalan: "",
    detailAlamat: "",
    kontakNama: "",
    kontakHubungan: "",
    kontakTelepon: "",
    namaBank: "",
    nomorRekening: "",
    namaPemilikRekening: "",
  });

  // Fetch karyawan by ID
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/${karyawanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        const detail = data.karyawan_detail || {};

        setFormData({
          id: data.id,
          fullName: data.full_name || "",
          email: data.email || "",
          jabatan: detail.posisi || "",
          status: detail.status || data.is_active ? "Aktif" : "Nonaktif",
          namaDepan: detail.nama_depan || "",
          namaBelakang: detail.nama_belakang || "",
          tanggalLahir: detail.tanggal_lahir || "",
          jenisKelamin: detail.jenis_kelamin || "",
          tinggiBadan: detail.tinggi_badan || "",
          beratBadan: detail.berat_badan || "",
          namaAlamat: detail.nama_alamat || "",
          namaJalan: detail.alamat_lengkap || "",
          detailAlamat: detail.detail_alamat || "",
          kontakNama: detail.nama_kontak_darurat || "",
          kontakHubungan: detail.hubungan_kontak_darurat || "",
          kontakTelepon: detail.nomor_telepon_darurat || "",
          namaBank: detail.nama_bank || "",
          nomorRekening: detail.nomor_rekening || "",
          namaPemilikRekening: detail.nama_pemilik_rekening || "",
        });
      } catch (err: any) {
        console.error("Error fetching karyawan:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.message || "Gagal memuat data karyawan",
        }).then(() => router.push("/admin/karyawan"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [karyawanId, router]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin ingin menyimpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/karyawan/${karyawanId}`,
        {
          ...formData,
          // Transform sesuai API backend jika perlu
          posisi: formData.jabatan,
          status: formData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data karyawan berhasil diperbarui",
      }).then(() => router.push(`/admin/karyawan/${karyawanId}`));
    } catch (err: any) {
      console.error("Error saving karyawan:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message || "Gagal menyimpan data karyawan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Data Karyawan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Diri */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="namaDepan" label="Nama Depan" value={formData.namaDepan} onChange={(v) => handleChange("namaDepan", v)} />
          <Input name="namaBelakang" label="Nama Belakang" value={formData.namaBelakang} onChange={(v) => handleChange("namaBelakang", v)} />
          <Input name="email" label="Email" type="email" value={formData.email} onChange={(v) => handleChange("email", v)} />
          <Input name="tanggalLahir" label="Tanggal Lahir" value={formData.tanggalLahir} onChange={(v) => handleChange("tanggalLahir", v)} />
          <Select name="jenisKelamin" label="Jenis Kelamin" value={formData.jenisKelamin} onChange={(v) => handleChange("jenisKelamin", v)} options={jenisKelaminOptions} />
          <Input name="tinggiBadan" label="Tinggi Badan (cm)" value={formData.tinggiBadan} onChange={(v) => handleChange("tinggiBadan", v)} />
          <Input name="beratBadan" label="Berat Badan (kg)" value={formData.beratBadan} onChange={(v) => handleChange("beratBadan", v)} />
        </div>

        {/* Alamat */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="namaAlamat" label="Nama Alamat" value={formData.namaAlamat} onChange={(v) => handleChange("namaAlamat", v)} />
          <Input name="namaJalan" label="Alamat Lengkap" value={formData.namaJalan} onChange={(v) => handleChange("namaJalan", v)} />
          <textarea value={formData.detailAlamat} onChange={(e) => handleChange("detailAlamat", e.target.value)} rows={3} className="md:col-span-2 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Kontak Darurat */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="kontakNama" label="Nama Kontak Darurat" value={formData.kontakNama} onChange={(v) => handleChange("kontakNama", v)} />
          <Input name="kontakHubungan" label="Hubungan" value={formData.kontakHubungan} onChange={(v) => handleChange("kontakHubungan", v)} />
          <Input name="kontakTelepon" label="Nomor Telepon" value={formData.kontakTelepon} onChange={(v) => handleChange("kontakTelepon", v)} />
        </div>

        {/* Rekening Bank */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="namaBank" label="Nama Bank" value={formData.namaBank} onChange={(v) => handleChange("namaBank", v)} />
          <Input name="nomorRekening" label="Nomor Rekening" value={formData.nomorRekening} onChange={(v) => handleChange("nomorRekening", v)} />
          <Input name="namaPemilikRekening" label="Nama Pemilik Rekening" value={formData.namaPemilikRekening} onChange={(v) => handleChange("namaPemilikRekening", v)} />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-700 bg-white border rounded-lg">Batal</button>
          <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-white bg-blue-600 rounded-lg">
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
