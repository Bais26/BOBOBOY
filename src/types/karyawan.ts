export interface Karyawan {
  id: string;
  nama: string;
  full_name: string;
  email: string;
  departemen: string;
  statusKaryawan: 'Kontrak' | 'Karyawan Tetap' | 'Magang';
  status: 'Aktif' | 'Nonaktif';
}

export type StatusKaryawan = 'Kontrak' | 'Karyawan Tetap' | 'Magang';
export type StatusAktif = 'Aktif' | 'Nonaktif';