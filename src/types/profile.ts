export interface Profile {
  namaDepan: string;
  namaBelakang: string;
  email: string;
  role: string;
  jenisKelamin: string;
  tanggalLahir: string;
  divisi: string;

  alamat: {
    namaAlamat: string;
    alamatLengkap: string;
    detail: string;
  };

  kontakDarurat: {
    nama: string;
    hubungan: string;
    telepon: string;
  };

  rekening: {
    bank: string;
    nomor: string;
    pemilik: string;
  };
}
