export interface KaryawanProfile {
  id: string;
  nama: string;
  email: string;
  jabatan: string;
  statusKaryawan: 'Kontrak' | 'Karyawan Tetap' | 'Magang';
  masukKantor: string;
  status: 'Aktif' | 'Nonaktif';
  
  // Data Diri
  namaDepan: string;
  namaBelakang: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tinggiBadan?: string;
  beratBadan?: string;
  
  // Alamat
  namaAlamat: string;
  pinLokasi: {
    lat: number;
    lng: number;
  };
  namaJalan: string;
  detailAlamat: string;
  
  // Kontak Darurat
  kontakDarurat: {
    nama: string;
    hubungan: string;
    nomorTelepon: string;
  };
  
  // Data Rekening Bank
  rekening?: {
    namaBank: string;
    namaRekening: string;
    nomorRekening: string;
    namaPemilikRekening: string;
  };
  
  avatar?: string;
}
