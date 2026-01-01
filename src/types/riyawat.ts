export type ModeKerja = "WFO" | "WFH";

export type StatusAbsensi = "Hadir" | "Izin" | "Sakit" | "Alpha";

export interface Absensi {
  id: string;
  tanggal: string;
  jamMasuk: string;
  jamPulang: string;
  jamKerja: string;
  modeKerja: ModeKerja;
  lokasi: string;
  status: StatusAbsensi;
}