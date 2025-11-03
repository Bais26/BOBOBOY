"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import { KaryawanProfile } from "@/types/profil";

// Mock function to get karyawan by ID
const getKaryawanById = (id: string): KaryawanProfile | null => {
  return {
    id: id,
    nama: "Bais Yufan",
    email: "Baisyufan2004@gmail.com",
    jabatan: "WEB DEVELOPER",
    statusKaryawan: "Kontrak",
    masukKantor: "24/09/2024",
    status: "Aktif",

    namaDepan: "Bais",
    namaBelakang: "Yufan",
    tanggalLahir: "28 November 2004",
    jenisKelamin: "Laki-laki",
    tinggiBadan: "179cm",
    beratBadan: "62kg",

    namaAlamat: "Apartemen",
    pinLokasi: { lat: -6.914744, lng: 107.60981 },
    namaJalan: "Jl. Sukaragara No.31, Antapani Kidul, Kec. Antapani, Kota Bandung",
    detailAlamat: "Depan ada Warung",

    kontakDarurat: {
      nama: "Dakna",
      hubungan: "Teman",
      nomorTelepon: "08123456789",
    },

    rekening: {
      namaBank: "BCA",
      namaRekening: "1234567891101",
      nomorRekening: "1234567891101",
      namaPemilikRekening: "M Bais Yufan Mardlansah",
    },
  };
};

interface FormData {
  id: string;
  jabatan: string;
  statusKaryawan: string;
  status: string;
  namaDepan: string;
  namaBelakang: string;
  email: string;
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
  namaRekening: string;
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

const statusKaryawanOptions = [
  { label: "Kontrak", value: "Kontrak" },
  { label: "Karyawan Tetap", value: "Karyawan Tetap" },
  { label: "Magang", value: "Magang" },
];

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Nonaktif", value: "Nonaktif" },
];

const jenisKelaminOptions = [
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
];

const bankOptions = [
  { label: "BCA", value: "BCA" },
  { label: "Mandiri", value: "Mandiri" },
  { label: "BNI", value: "BNI" },
  { label: "BRI", value: "BRI" },
];

export default function EditKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const karyawanId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    jabatan: "",
    statusKaryawan: "",
    status: "",
    namaDepan: "",
    namaBelakang: "",
    email: "",
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
    namaRekening: "",
    nomorRekening: "",
    namaPemilikRekening: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = getKaryawanById(karyawanId);
        if (!data) {
          router.push("/admin/karyawan");
          return;
        }

        setFormData({
          id: data.id,
          jabatan: data.jabatan,
          statusKaryawan: data.statusKaryawan,
          status: data.status,
          namaDepan: data.namaDepan,
          namaBelakang: data.namaBelakang,
          email: data.email,
          tanggalLahir: data.tanggalLahir,
          jenisKelamin: data.jenisKelamin,
          tinggiBadan: data.tinggiBadan,
          beratBadan: data.beratBadan,
          namaAlamat: data.namaAlamat,
          namaJalan: data.namaJalan,
          detailAlamat: data.detailAlamat,
          kontakNama: data.kontakDarurat.nama,
          kontakHubungan: data.kontakDarurat.hubungan,
          kontakTelepon: data.kontakDarurat.nomorTelepon,
          namaBank: data.rekening.namaBank,
          namaRekening: data.rekening.namaRekening,
          nomorRekening: data.rekening.nomorRekening,
          namaPemilikRekening: data.rekening.namaPemilikRekening,
        });
      } catch (error) {
        console.error("Error fetching karyawan:", error);
        router.push("/admin/karyawan");
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
    setIsSaving(true);

    try {
      // TODO: Implement API call to update karyawan
      console.log("Saving data:", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("Data karyawan berhasil diperbarui!");
      router.push(`/admin/karyawan/${karyawanId}`);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Gagal menyimpan data!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <nav className="text-sm text-gray-500 mb-1">
              <span
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => router.push("/admin/dashboard")}
              >
                Dashboard
              </span>
              <span className="mx-2">/</span>
              <span
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => router.push("/admin/karyawan")}
              >
                admin
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">Edit Karyawan</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-800">
              Edit Data Karyawan
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Profil
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ID Karyawan"
              name="id"
              value={formData.id}
              onChange={(value) => handleChange("id", value)}
              disabled
            />
            <Select
              label="Jabatan"
              name="jabatan"
              value={formData.jabatan}
              onChange={(value) => handleChange("jabatan", value)}
              options={jabatanOptions}
              required
            />
            <Select
              label="Status Karyawan"
              name="statusKaryawan"
              value={formData.statusKaryawan}
              onChange={(value) => handleChange("statusKaryawan", value)}
              options={statusKaryawanOptions}
              required
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(value) => handleChange("status", value)}
              options={statusOptions}
              required
            />
          </div>
        </div>

        {/* Data Diri */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Data Diri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Depan"
              name="namaDepan"
              value={formData.namaDepan}
              onChange={(value) => handleChange("namaDepan", value)}
              required
            />
            <Input
              label="Nama Belakang"
              name="namaBelakang"
              value={formData.namaBelakang}
              onChange={(value) => handleChange("namaBelakang", value)}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              required
            />
            <Input
              label="Tanggal Lahir"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={(value) => handleChange("tanggalLahir", value)}
              placeholder="DD/MM/YYYY"
            />
            <Select
              label="Jenis Kelamin"
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={(value) => handleChange("jenisKelamin", value)}
              options={jenisKelaminOptions}
              required
            />
            <Input
              label="Tinggi Badan (cm)"
              name="tinggiBadan"
              value={formData.tinggiBadan}
              onChange={(value) => handleChange("tinggiBadan", value)}
            />
            <Input
              label="Berat Badan (kg)"
              name="beratBadan"
              value={formData.beratBadan}
              onChange={(value) => handleChange("beratBadan", value)}
            />
          </div>
        </div>

        {/* Alamat */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Alamat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Alamat"
              name="namaAlamat"
              value={formData.namaAlamat}
              onChange={(value) => handleChange("namaAlamat", value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Nama Jalan, Kecamatan, Kota"
                name="namaJalan"
                value={formData.namaJalan}
                onChange={(value) => handleChange("namaJalan", value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Detail Alamat
              </label>
              <textarea
                value={formData.detailAlamat}
                onChange={(e) => handleChange("detailAlamat", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Kontak Darurat */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Kontak Darurat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nama"
              name="kontakNama"
              value={formData.kontakNama}
              onChange={(value) => handleChange("kontakNama", value)}
            />
            <Input
              label="Hubungan"
              name="kontakHubungan"
              value={formData.kontakHubungan}
              onChange={(value) => handleChange("kontakHubungan", value)}
            />
            <Input
              label="Nomor Telepon"
              name="kontakTelepon"
              type="tel"
              value={formData.kontakTelepon}
              onChange={(value) => handleChange("kontakTelepon", value)}
            />
          </div>
        </div>

        {/* Rekening Bank */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Data Rekening Bank
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Nama Bank"
              name="namaBank"
              value={formData.namaBank}
              onChange={(value) => handleChange("namaBank", value)}
              options={bankOptions}
            />
            <Input
              label="Nama Rekening"
              name="namaRekening"
              value={formData.namaRekening}
              onChange={(value) => handleChange("namaRekening", value)}
            />
            <Input
              label="Nomor Rekening"
              name="nomorRekening"
              value={formData.nomorRekening}
              onChange={(value) => handleChange("nomorRekening", value)}
            />
            <Input
              label="Nama Pemilik Rekening"
              name="namaPemilikRekening"
              value={formData.namaPemilikRekening}
              onChange={(value) => handleChange("namaPemilikRekening", value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-lg shadow-sm p-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
