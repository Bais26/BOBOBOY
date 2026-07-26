// ─── API Response Types ──────────────────────────────────────────────────────

export type WorkStatus = "WFO" | "WFH";
export type CheckInStatus = "ontime" | "terlambat";
export type CheckOutStatus = "normal" | "pulang_awal";

export interface AttendanceDetail {
  tanggal: string;
  hari: string;
  check_in_time: string;
  check_out_time: string;
  check_in_status: CheckInStatus;
  check_out_status: CheckOutStatus;
  work_status: WorkStatus;
  office_location_name: string;
  durasi_kerja: string;
  is_validated: boolean;
}

export interface AttendanceSummary {
  periode: string;
  filter_type: string;
  total_hari_kerja: number;
  total_hadir: number;
  total_absen: number;
  total_alfa: number;
  total_wfo: number;
  total_wfh: number;
  total_ontime: number;
  total_terlambat: number;
  total_pulang_awal: number;
  total_menit_kerja: number;
  rata_rata_menit_kerja: number;
  attendance_rate: number;
}

// Per-karyawan record dalam list rekap admin
export interface RekapKaryawan {
  id: string | number;
  user_id: string | number;
  nama_lengkap: string;
  email: string;
  posisi: string;
  divisi: string;
  total_hadir: number;
  total_absen: number;
  total_alfa: number;
  total_wfo: number;
  total_wfh: number;
  total_ontime: number;
  total_terlambat: number;
  total_pulang_awal: number;
  total_menit_kerja: number;
  rata_rata_menit_kerja: number | null;
  attendance_rate: number;
}

// Response dari GET /api/v1/attendance (admin)
export interface RekapAdminResponse {
  summary: AttendanceSummary;
  karyawan: RekapKaryawan[];
  total_karyawan: number;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export type FilterType = "month" | "week" | "year";

export interface RekapQueryParams {
  // Filter karyawan
  nama_lengkap?: string;
  email?: string;
  divisi?: string;
  posisi?: string;
  user_id?: string | number;
  // Filter periode
  filter?: FilterType;
  year?: number;
  month?: number; // 1–12
  week?: number;
  // Filter status
  work_status?: WorkStatus;
  // Pagination
  page?: number;
  limit?: number;
}

// ─── UI / Table Row ───────────────────────────────────────────────────────────

export interface RekapTableRow {
  id: string | number;
  tanggal?: string;
  check_in_time?: string;
  check_out_time?: string;
  user_id: string | number;
  nama_lengkap: string;
  email: string;
  posisi: string;
  divisi: string;
  hadir: string;
  terlambat: string;
  alfa: string;
  wfo?: string;
  wfh?: string;
  total_jam_kerja: string;
}