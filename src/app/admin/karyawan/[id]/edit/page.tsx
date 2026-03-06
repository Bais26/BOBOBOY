'use client';
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import api from "@/lib/api";

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
        // Using axios instance from lib/api.ts
        const res = await api.get(`/v1/karyawan/${karyawanId}`);

        const data = res.data;
        const detail = data.karyawan_detail || {};

        setFormData({
          id: data.id,
          fullName: data.full_name || "",
          email: data.email || "",
          jabatan: data.posisi || detail.posisi || "",
          status: detail.status || (data.is_active ? "Aktif" : "Nonaktif"),
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
          text: err.response?.data?.message || err.message || "Gagal memuat data karyawan",
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
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    setIsSaving(true);
    try {
      // Prepare payload
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        posisi: formData.jabatan,
        is_active: formData.status === "Aktif",
        karyawan_detail: {
          nama_depan: formData.namaDepan,
          nama_belakang: formData.namaBelakang,
          tanggal_lahir: formData.tanggalLahir,
          jenis_kelamin: formData.jenisKelamin,
          tinggi_badan: formData.tinggiBadan,
          berat_badan: formData.beratBadan,
          nama_alamat: formData.namaAlamat,
          alamat_lengkap: formData.namaJalan,
          detail_alamat: formData.detailAlamat,
          nama_kontak_darurat: formData.kontakNama,
          hubungan_kontak_darurat: formData.kontakHubungan,
          nomor_telepon_darurat: formData.kontakTelepon,
          nama_bank: formData.namaBank,
          nomor_rekening: formData.nomorRekening,
          nama_pemilik_rekening: formData.namaPemilikRekening,
          status: formData.status,
        },
      };

      // Debug: Log payload yang akan dikirim
      console.log('=== PAYLOAD YANG DIKIRIM ===');
      console.log('Full Payload:', JSON.stringify(payload, null, 2));
      console.log('Nama Bank:', formData.namaBank);
      console.log('Nomor Rekening:', formData.nomorRekening);
      console.log('Nama Pemilik:', formData.namaPemilikRekening);
      console.log('===========================');

      // Using axios instance from lib/api.ts
      // PUT to /api/v1/karyawan/{karyawan_id}/detail
      const response = await api.put(`/v1/karyawan/${karyawanId}/detail`, payload);
      
      // Debug: Log response dari server
      console.log('=== RESPONSE DARI SERVER ===');
      console.log('Response:', response.data);
      console.log('===========================');

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data karyawan berhasil diperbarui",
        confirmButtonColor: "#3b82f6",
      });

      router.push(`/admin/karyawan/${karyawanId}`);
    } catch (err: any) {
      console.error("Error saving karyawan:", err);
      
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || err.message || "Gagal menyimpan data karyawan",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data karyawan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Data Karyawan</h1>
          <p className="text-sm text-gray-500 mt-1">ID: {formData.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Utama */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Utama</h2>
            <p className="text-sm text-gray-500 mt-1">Informasi dasar karyawan</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="fullName" 
              label="Nama Lengkap" 
              value={formData.fullName} 
              onChange={(v) => handleChange("fullName", v)}
              required
            />
            <Input 
              name="email" 
              label="Email" 
              type="email" 
              value={formData.email} 
              onChange={(v) => handleChange("email", v)}
              required
            />
            <Select 
              name="jabatan" 
              label="Jabatan" 
              value={formData.jabatan} 
              onChange={(v) => handleChange("jabatan", v)} 
              options={jabatanOptions}
              required
            />
            <Select 
              name="status" 
              label="Status Karyawan" 
              value={formData.status} 
              onChange={(v) => handleChange("status", v)} 
              options={statusOptions}
              required
            />
          </div>
        </div>

        {/* Data Diri */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Diri</h2>
            <p className="text-sm text-gray-500 mt-1">Informasi pribadi karyawan</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="namaDepan" 
              label="Nama Depan" 
              value={formData.namaDepan} 
              onChange={(v) => handleChange("namaDepan", v)} 
            />
            <Input 
              name="namaBelakang" 
              label="Nama Belakang" 
              value={formData.namaBelakang} 
              onChange={(v) => handleChange("namaBelakang", v)} 
            />
            <Input 
              name="tanggalLahir" 
              label="Tanggal Lahir" 
              type="date"
              value={formData.tanggalLahir} 
              onChange={(v) => handleChange("tanggalLahir", v)} 
            />
            <Select 
              name="jenisKelamin" 
              label="Jenis Kelamin" 
              value={formData.jenisKelamin} 
              onChange={(v) => handleChange("jenisKelamin", v)} 
              options={jenisKelaminOptions} 
            />
            <Input 
              name="tinggiBadan" 
              label="Tinggi Badan (cm)" 
              type="number"
              value={formData.tinggiBadan} 
              onChange={(v) => handleChange("tinggiBadan", v)} 
            />
            <Input 
              name="beratBadan" 
              label="Berat Badan (kg)" 
              type="number"
              value={formData.beratBadan} 
              onChange={(v) => handleChange("beratBadan", v)} 
            />
          </div>
        </div>

        {/* Alamat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Alamat</h2>
            <p className="text-sm text-gray-500 mt-1">Informasi alamat tempat tinggal</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="namaAlamat" 
              label="Nama Alamat" 
              value={formData.namaAlamat} 
              onChange={(v) => handleChange("namaAlamat", v)} 
              placeholder="Contoh: Rumah, Kost, dll"
            />
            <Input 
              name="namaJalan" 
              label="Alamat Lengkap" 
              value={formData.namaJalan} 
              onChange={(v) => handleChange("namaJalan", v)} 
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detail Alamat
              </label>
              <textarea 
                value={formData.detailAlamat} 
                onChange={(e) => handleChange("detailAlamat", e.target.value)} 
                rows={3} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Informasi tambahan tentang alamat"
              />
            </div>
          </div>
        </div>

        {/* Kontak Darurat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kontak Darurat</h2>
            <p className="text-sm text-gray-500 mt-1">Informasi kontak yang dapat dihubungi dalam keadaan darurat</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              name="kontakNama" 
              label="Nama Kontak Darurat" 
              value={formData.kontakNama} 
              onChange={(v) => handleChange("kontakNama", v)} 
            />
            <Input 
              name="kontakHubungan" 
              label="Hubungan" 
              value={formData.kontakHubungan} 
              onChange={(v) => handleChange("kontakHubungan", v)} 
              placeholder="Contoh: Orang Tua, Saudara"
            />
            <Input 
              name="kontakTelepon" 
              label="Nomor Telepon" 
              type="tel"
              value={formData.kontakTelepon} 
              onChange={(v) => handleChange("kontakTelepon", v)} 
              placeholder="Contoh: 08123456789"
            />
          </div>
        </div>

        {/* Rekening Bank */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Rekening Bank</h2>
            <p className="text-sm text-gray-500 mt-1">Informasi rekening untuk transfer gaji</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="namaBank" 
              label="Nama Bank" 
              value={formData.namaBank} 
              onChange={(v) => handleChange("namaBank", v)} 
              placeholder="Contoh: BCA, Mandiri, BNI"
            />
            <Input 
              name="nomorRekening" 
              label="Nomor Rekening" 
              value={formData.nomorRekening} 
              onChange={(v) => handleChange("nomorRekening", v)} 
              placeholder="Nomor rekening bank"
            />
            <div className="md:col-span-2">
              <Input 
                name="namaPemilikRekening" 
                label="Nama Pemilik Rekening" 
                value={formData.namaPemilikRekening} 
                onChange={(v) => handleChange("namaPemilikRekening", v)} 
                placeholder="Sesuai dengan nama di buku rekening"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSaving}
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}