interface Division {
  id: string;
  name: string;
}

interface KaryawanDetail {
  posisi: string;
  status: StatusKaryawan;
  division: Division;
  // Anda bisa menambahkan properti lain dari karyawan_detail di sini jika diperlukan
}

export interface Karyawan {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  karyawan_detail: KaryawanDetail | null;
  // Properti di bawah ini tampaknya sudah tidak digunakan berdasarkan kode page.tsx Anda,
  // namun saya biarkan untuk referensi. Anda bisa menghapusnya jika sudah tidak relevan.
  nama?: string;
  departemen?: string;
  statusKaryawan?: StatusKaryawan;
  status?: 'Aktif' | 'Nonaktif';
}

export type StatusKaryawan = 'Kontrak' | 'Karyawan Tetap' | 'Magang';
export type StatusAktif = 'Aktif' | 'Nonaktif';