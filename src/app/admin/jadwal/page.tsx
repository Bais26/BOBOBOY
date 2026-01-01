"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, BuildingOfficeIcon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchInput from "@/components/shared/SearchInput";
import FilterButton from "@/components/shared/FilterButton";
import Pagination from "@/components/shared/Pagination";

// Mock data dengan status per hari
type DayStatus = "WFH" | "WFO" | "OFF";

interface RekapWithSchedule {
  id: string;
  nama: string;
  jabatan: string;
  status: "Aktif" | "Nonaktif";
  schedule: {
    senin: DayStatus;
    selasa: DayStatus;
    rabu: DayStatus;
    kamis: DayStatus;
    jumat: DayStatus;
    sabtu: DayStatus;
    minggu: DayStatus;
  };
}

const generateSchedule = () => {
  const statuses: DayStatus[] = ["WFH", "WFO", "OFF"];
  return {
    senin: statuses[Math.floor(Math.random() * 3)],
    selasa: statuses[Math.floor(Math.random() * 3)],
    rabu: statuses[Math.floor(Math.random() * 3)],
    kamis: statuses[Math.floor(Math.random() * 3)],
    jumat: statuses[Math.floor(Math.random() * 3)],
    sabtu: "OFF" as DayStatus,
    minggu: "OFF" as DayStatus,
  };
};

const mockData: RekapWithSchedule[] = Array.from({ length: 100 }, (_, i) => ({
  id: `CBN${234 + i}`,
  nama: ["Bais Yufan", "Muhit Ramadhan", "Yasir", "Zulfan"][i % 4],
  jabatan: "Frontend Developer",
  status: "Aktif",
  schedule: generateSchedule(),
}));

export default function ManagementRekapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(mockData);
  const [showLokasiModal, setShowLokasiModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const itemsPerPage = 10;

  // Form states untuk Tambah Lokasi WFO
  const [lokasiForm, setLokasiForm] = useState({
    namaLokasi: "",
    kapasitasMaksimal: "",
    alamatLengkap: "",
    latitude: "",
    longitude: "",
    radiusCheckIn: "",
  });

  // Form states untuk Generate Jadwal
  const [generateForm, setGenerateForm] = useState({
    konfigurasi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    kapasitasKantor: "",
    minWFO: "",
    maxWFO: "",
    populationSize: "",
    generations: "",
    mutationRate: "",
  });

  const filteredData = data.filter((karyawan) => {
    const q = searchQuery.toLowerCase();
    return (
      karyawan.nama.toLowerCase().includes(q) ||
      karyawan.id.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleScheduleChange = (
    karyawanId: string,
    day: keyof RekapWithSchedule["schedule"],
    newStatus: DayStatus
  ) => {
    setData((prevData) =>
      prevData.map((karyawan) =>
        karyawan.id === karyawanId
          ? {
              ...karyawan,
              schedule: {
                ...karyawan.schedule,
                [day]: newStatus,
              },
            }
          : karyawan
      )
    );
  };

  const handleLokasiSubmit = () => {
    console.log("Submit Lokasi:", lokasiForm);
    alert("Lokasi WFO berhasil ditambahkan!");
    setShowLokasiModal(false);
    setLokasiForm({
      namaLokasi: "",
      kapasitasMaksimal: "",
      alamatLengkap: "",
      latitude: "",
      longitude: "",
      radiusCheckIn: "",
    });
  };

  const handleGenerateSubmit = () => {
    console.log("Generate Jadwal:", generateForm);
    alert("Jadwal berhasil di-generate!");
    setShowGenerateModal(false);
  };

  // Render schedule cell dengan dropdown lebih compact
  const renderScheduleCell = (
    karyawan: RekapWithSchedule,
    day: keyof RekapWithSchedule["schedule"]
  ) => {
    const status = karyawan.schedule[day];
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative inline-block">
          <select
            value={status}
            onChange={(e) =>
              handleScheduleChange(karyawan.id, day, e.target.value as DayStatus)
            }
            className={`
              appearance-none cursor-pointer border rounded px-2 py-1 pr-6 text-xs font-medium min-w-[70px]
              ${status === "WFH" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
              ${status === "WFO" ? "bg-green-50 text-green-700 border-green-200" : ""}
              ${status === "OFF" ? "bg-gray-50 text-gray-500 border-gray-200" : ""}
              hover:opacity-80 transition-opacity focus:outline-none focus:ring-1
              ${status === "WFH" ? "focus:ring-blue-400" : ""}
              ${status === "WFO" ? "focus:ring-green-400" : ""}
              ${status === "OFF" ? "focus:ring-gray-300" : ""}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="WFH">WFH</option>
            <option value="WFO">WFO</option>
            <option value="OFF">OFF</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
            {status === "WFH" && <HomeIcon className="w-3.5 h-3.5 text-blue-700" />}
            {status === "WFO" && <BuildingOfficeIcon className="w-3.5 h-3.5 text-green-700" />}
            {status === "OFF" && <span className="text-gray-400 text-xs">-</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header with Panduan */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Panduan</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-blue-600" />
                <span>Work From Home (WFH)</span>
              </div>
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-4 h-4 text-green-600" />
                <span>Work From Office (WFO)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">-</span>
                <span>Hari libur</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Klik ikon atau dropdown untuk mengubah jadwal karyawan atau klik tambah karyawan untuk menambahkan jadwal kerja ke karyawan
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari Nama Karyawan atau Jenis Industri"
            />
          </div>
          <div className="flex items-center gap-3">
            <FilterButton
              label="Pilih Status"
              options={[
                { label: "Kontrak", value: "Kontrak" },
                { label: "Karyawan Tetap", value: "Karyawan Tetap" },
                { label: "Magang", value: "Magang" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <button
              onClick={() => setShowLokasiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              Tambah Lokasi WFO
            </button>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Generate Jadwal
            </button>
            <button
              onClick={() => router.push("/admin/karyawan/create")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Karyawan
            </button>
          </div>
        </div>
      </div>

      {/* Custom Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Nama Karyawan
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Senin
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Selasa
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Rabu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Kamis
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Jum'at
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Sabtu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Minggu
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((karyawan) => (
                <tr
                  key={karyawan.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/karyawan/${karyawan.id}`)}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-900 text-sm">{karyawan.id}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-medium text-gray-900 text-sm">{karyawan.nama}</div>
                      <div className="text-xs text-gray-500">{karyawan.jabatan}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Aktif
                    </span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "senin")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "selasa")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "rabu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "kamis")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "jumat")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "sabtu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {renderScheduleCell(karyawan, "minggu")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-center">
                    <button 
                      className="text-gray-400 hover:text-gray-600" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Tambah Lokasi WFO */}
      {showLokasiModal && (
        <div className="fixed inset-0 bg-opacity-40 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Manajemen Lokasi WFO</h2>
              <button
                onClick={() => setShowLokasiModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Tambah lokasi kantor untuk untuk absensi dengan validasi GPS
              </p>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <PlusIcon className="w-5 h-5" />
                Tambah Lokasi
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tambah Lokasi WFO Baru
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Isi form untuk lokasi WFO baru (Nama)</p>
                  <input
                    type="text"
                    placeholder="Nama Lokasi"
                    value={lokasiForm.namaLokasi}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, namaLokasi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas Maksimal
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi kapasitas untuk WFO dikantor ini (maksimal WFO per hari bisa isi 50-100 orang)
                  </p>
                  <input
                    type="number"
                    placeholder="Kapasitas Maksimal"
                    value={lokasiForm.kapasitasMaksimal}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, kapasitasMaksimal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi alamat lengkap dari lokasi untuk di identifikasi lokasi manual
                  </p>
                  <textarea
                    placeholder="Alamat Lengkap"
                    value={lokasiForm.alamatLengkap}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, alamatLengkap: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={lokasiForm.latitude}
                      onChange={(e) => setLokasiForm({ ...lokasiForm, latitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={lokasiForm.longitude}
                      onChange={(e) => setLokasiForm({ ...lokasiForm, longitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radius Check-in (Meter)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi maksimal untuk Check in dari lokasi GPS (50-100 Meter)
                  </p>
                  <input
                    type="number"
                    placeholder="Radius Check-in"
                    value={lokasiForm.radiusCheckIn}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, radiusCheckIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Kantor Pusat Antopeni</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Jl. Setyakusuma no 98, Antopeni, Kaju, Kaju Emot Utara
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>GPS: +1.2509380,116.121.1119812909257</p>
                        <p>Radius: 100m</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Edit
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-700 font-medium">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowLokasiModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleLokasiSubmit}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generate Jadwal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-opacity-40 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Generate Jadwal Kerja Otomatis</h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Sistem akan mengautomatkan distribusi WFO/WFH menggunakan Algoritma Genetika
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfigurasi Pembedivisian
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Per 50 / Per 25 / Rata-Rata</p>
                  <select
                    value={generateForm.konfigurasi}
                    onChange={(e) => setGenerateForm({ ...generateForm, konfigurasi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih Konfigurasi</option>
                    <option value="per50">Per 50</option>
                    <option value="per25">Per 25</option>
                    <option value="ratarata">Rata-Rata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={generateForm.tanggalMulai}
                    onChange={(e) => setGenerateForm({ ...generateForm, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={generateForm.tanggalSelesai}
                    onChange={(e) => setGenerateForm({ ...generateForm, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas Kantor (orang)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi maksimal orang yang dapat masuk ke kantor (dalam satu minggu minimal 10-100 orang)
                  </p>
                  <input
                    type="number"
                    placeholder="Kapasitas Kantor"
                    value={generateForm.kapasitasKantor}
                    onChange={(e) => setGenerateForm({ ...generateForm, kapasitasKantor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min WFO per Minggu
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi minimal orang yang bisa WFO dikantor (dalam sehari bisa masuk 10-100 orang)
                  </p>
                  <input
                    type="number"
                    placeholder="Min WFO"
                    value={generateForm.minWFO}
                    onChange={(e) => setGenerateForm({ ...generateForm, minWFO: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max WFO per Minggu
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Isi maksimal orang yang bisa WFO dikantor (dalam sehari bisa masuk 10-100 orang)
                  </p>
                  <input
                    type="number"
                    placeholder="Max WFO"
                    value={generateForm.maxWFO}
                    onChange={(e) => setGenerateForm({ ...generateForm, maxWFO: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parameter Algoritma Genetika
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Population Size
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={generateForm.populationSize}
                    onChange={(e) => setGenerateForm({ ...generateForm, populationSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Generations
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={generateForm.generations}
                    onChange={(e) => setGenerateForm({ ...generateForm, generations: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mutation Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    value={generateForm.mutationRate}
                    onChange={(e) => setGenerateForm({ ...generateForm, mutationRate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateSubmit}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}