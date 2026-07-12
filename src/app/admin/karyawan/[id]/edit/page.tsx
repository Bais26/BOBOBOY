'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import api from "@/lib/api";

import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select"; // Kita akan ganti dengan CreatableSelect
import CreatableSelect from 'react-select/creatable';

import useLocalStorage from "@/hooks/useLocalStorage";

interface SelectOption {
  value: string;
  label: string;
  __isNew__?: boolean;
  division?: { id?: string; name?: string };
}

interface Division {
  id: string;
  name: string;
}

interface FormData {
  id: string;
  fullName: string;
  email: string;
  division: SelectOption | null;
  status: string;
  namaDepan: string;
  namaBelakang: string;
  tanggalLahir: string;
  jenisKelamin: string;
  namaAlamat: string;
  namaJalan: string;
  detailAlamat: string;
  kontakNama: string;
  kontakHubungan: string;
  kontakTelepon: string;
  subdivision: SelectOption | null;
}

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Nonaktif", value: "Nonaktif" },
];

const jenisKelaminOptions = [
  { label: "Laki-laki", value: "LAKI-LAKI" },
  { label: "Perempuan", value: "PEREMPUAN" },
];

export default function EditKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const karyawanId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [subdivisionOptions, setSubdivisionOptions] = useState<SelectOption[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<Division[]>([]);
  const [filteredSubdivisionOptions, setFilteredSubdivisionOptions] = useState<SelectOption[]>([]);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    fullName: "",
    email: "",
    division: null,
    status: "",
    namaDepan: "",
    namaBelakang: "",
    tanggalLahir: "",
    jenisKelamin: "",
    namaAlamat: "",
    namaJalan: "",
    detailAlamat: "",
    kontakNama: "",
    kontakHubungan: "",
    kontakTelepon: "",
    subdivision: null,
  });

  // Fetch karyawan by ID
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch karyawan, subdivisi, dan divisi secara paralel
        const [karyawanRes, subdivisionsRes, divisionsRes] = await Promise.all([
          api.get(`/v1/karyawan/${karyawanId}`),
          api.get('/v1/subdivisions'), // Asumsi endpoint ini ada
          api.get('/v1/divisions')      // Asumsi endpoint ini ada
        ]);

        const data = karyawanRes.data;
        const detail = data.karyawan_detail || {};

        const fetchedSubdivisions = subdivisionsRes.data.map((sub: any) => ({
          value: sub.id,
          label: sub.name,
          division: sub.division,
        }));
        setSubdivisionOptions(fetchedSubdivisions);
        setDivisionOptions(divisionsRes.data);

        const currentSubdivision = fetchedSubdivisions.find((sub: SelectOption) => sub.value === detail.subdivision_id);
        const currentDivision = divisionsRes.data.find((div: Division) => div.id === currentSubdivision?.division?.id);

        setFormData({
          id: data.id,
          fullName: data.full_name || "",
          email: data.email || "",
          division: currentDivision ? { value: currentDivision.id, label: currentDivision.name } : null,
          status: detail.status || (data.is_active ? "Aktif" : "Nonaktif"),
          namaDepan: detail.nama_depan || "",
          namaBelakang: detail.nama_belakang || "",
          tanggalLahir: detail.tanggal_lahir || "",
          jenisKelamin: (detail.jenis_kelamin || "").toUpperCase(),
          namaAlamat: detail.nama_alamat || "",
          namaJalan: detail.alamat_lengkap || "",
          detailAlamat: detail.detail_alamat || "",
          kontakNama: detail.nama_kontak_darurat || "",
          kontakHubungan: detail.hubungan_kontak_darurat || "",
          kontakTelepon: detail.nomor_telepon_darurat || "",
          subdivision: currentSubdivision || null,
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

  // Efek untuk memfilter subdivisi berdasarkan divisi yang dipilih
  useEffect(() => {
    if (formData.division) {
      const filtered = subdivisionOptions.filter(
        (sub) => sub.division?.id === formData.division?.value
      );
      setFilteredSubdivisionOptions(filtered);
    } else {
      setFilteredSubdivisionOptions([]);
    }
  }, [formData.division, subdivisionOptions]);

  const handleChange = (field: keyof FormData, value: any) => {
    // Jika divisi berubah, reset subdivisi
    if (field === 'division') {
      setFormData((prev) => ({ ...prev, subdivision: null, [field]: value }));
      return;
    }
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

    // Construct division_input payload
    let divisionInput = null;
    if (formData.division) {
      if (formData.division.__isNew__) {
        // Membuat divisi baru
        divisionInput = { name: formData.division.label };
      } else {
        // Memilih divisi yang sudah ada
        divisionInput = { id: formData.division.value };
      }
    }
    // Construct subdivision_input payload
    let subdivisionInput = null;
    if (formData.subdivision) {
      if (formData.subdivision.__isNew__) {
        // Skenario 2 & 3: Membuat subdivisi baru
        subdivisionInput = {
          name: formData.subdivision.label,
          division: divisionInput, // Gunakan divisionInput yang sudah dibuat
        };
        if (!subdivisionInput.division) {
          throw new Error("Divisi harus dipilih atau dibuat untuk membuat subdivisi baru.");
        }
      } else {
        // Skenario 1: Memilih subdivisi yang sudah ada
        subdivisionInput = { id: formData.subdivision.value };
      }
    } else if (formData.division) {
      // Jika hanya divisi yang dipilih/dibuat (tanpa subdivisi)
      subdivisionInput = { division: divisionInput };
    }

    try {
      // Prepare payload
      const payload = {
        detail: {
          nama_depan: formData.namaDepan,
          nama_belakang: formData.namaBelakang,
          tanggal_lahir: formData.tanggalLahir,
          jenis_kelamin: formData.jenisKelamin,
          status: formData.status,
          nama_alamat: formData.namaAlamat,
          alamat_lengkap: formData.namaJalan,
          detail_alamat: formData.detailAlamat,
          nama_kontak_darurat: formData.kontakNama,
          hubungan_kontak_darurat: formData.kontakHubungan,
          nomor_telepon_darurat: formData.kontakTelepon,
          // Data lain yang mungkin ada di form
          // nama_bank, nomor_rekening, etc. perlu ditambahkan di state & form jika ingin di-update
        },
        // Menggunakan nama 'subdivision' sesuai permintaan, bukan 'subdivision_input'
        subdivision: subdivisionInput,
      };

      // Debug: Log payload yang akan dikirim
      console.log('=== PAYLOAD YANG DIKIRIM ===');
      console.log('Full Payload:', JSON.stringify(payload, null, 2));
      console.log('===========================');
      
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
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <CreatableSelect
                isClearable
                id="division"
                placeholder="Pilih atau ketik untuk membuat Divisi"
                options={divisionOptions.map(d => ({ label: d.name, value: d.id }))}
                value={formData.division}
                onChange={(newValue) => handleChange("division", newValue)}
                onCreateOption={(inputValue) => {
                  const newOption: SelectOption = {
                    value: inputValue.toLowerCase().replace(/\W/g, ''),
                    label: inputValue,
                    __isNew__: true,
                  };
                  setDivisionOptions((prev) => [...prev, { id: newOption.value, name: newOption.label }]);
                  handleChange("division", newOption);
                }}
                formatCreateLabel={(inputValue) => `Buat Divisi baru: "${inputValue}"`}
              />
            </div>
            <Select 
              name="status" 
              label="Status Karyawan" 
              value={formData.status} 
              onChange={(v) => handleChange("status", v)} 
              options={statusOptions}
              required
            />
            <div>
              <label htmlFor="subdivision" className="block text-sm font-medium text-gray-700 mb-2">Subdivisi</label>
              <CreatableSelect
                isClearable
                id="subdivision"
                placeholder={!formData.division ? "Pilih Divisi terlebih dahulu" : "Pilih atau ketik untuk membuat Subdivisi"}
                options={filteredSubdivisionOptions}
                value={formData.subdivision}
                onChange={(newValue) => handleChange("subdivision", newValue)}
                onCreateOption={(inputValue) => {
                  const newOption: SelectOption = {
                    value: inputValue.toLowerCase().replace(/\W/g, ''),
                    label: inputValue,
                    __isNew__: true,
                    division: { id: formData.division?.value } // Tautkan ke divisi yg sedang dipilih
                  };
                  setSubdivisionOptions((prev) => [...prev, newOption]);
                  handleChange("subdivision", newOption);
                }}
                formatCreateLabel={(inputValue) => `Buat Subdivisi baru: "${inputValue}"`}
                isDisabled={!formData.division}
              />
            </div>
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
              required
            />
            <Input 
              name="namaBelakang" 
              label="Nama Belakang" 
              value={formData.namaBelakang} 
              onChange={(v) => handleChange("namaBelakang", v)} 
              required
            />
            <Input 
              name="tanggalLahir" 
              label="Tanggal Lahir" 
              type="date"
              value={formData.tanggalLahir} 
              onChange={(v) => handleChange("tanggalLahir", v)} 
              required
            />
            <Select 
              name="jenisKelamin" 
              label="Jenis Kelamin" 
              value={formData.jenisKelamin} 
              onChange={(v) => handleChange("jenisKelamin", v)} 
              options={jenisKelaminOptions} 
              required
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
              required
            />
            <Input 
              name="namaJalan" 
              label="Alamat Lengkap" 
              value={formData.namaJalan} 
              onChange={(v) => handleChange("namaJalan", v)} 
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
              required
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
                required
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
              required
            />
            <Input 
              name="kontakHubungan" 
              label="Hubungan" 
              value={formData.kontakHubungan} 
              onChange={(v) => handleChange("kontakHubungan", v)} 
              placeholder="Contoh: Orang Tua, Saudara"
              required
            />
            <Input 
              name="kontakTelepon" 
              label="Nomor Telepon" 
              type="tel"
              value={formData.kontakTelepon} 
              onChange={(v) => handleChange("kontakTelepon", v)} 
              placeholder="Contoh: 08123456789"
              required
            />
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