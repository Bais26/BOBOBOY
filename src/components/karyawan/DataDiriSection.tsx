import { UserIcon } from '@heroicons/react/24/outline';
import InfoCard from '@/components/shared/InfoCard';
import InfoRow from '@/components/shared/InfoRow';

interface DataDiriSectionProps {
  namaDepan: string;
  namaBelakang: string;
  tanggalLahir: string;
  jenisKelamin: string;
  tinggiBadan: string;
  beratBadan: string;
}

export default function DataDiriSection({
  namaDepan,
  namaBelakang,
  tanggalLahir,
  jenisKelamin,
  tinggiBadan,
  beratBadan,
}: DataDiriSectionProps) {
  return (
    <InfoCard title="Data Diri" icon={<UserIcon className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoRow label="Nama Depan" value={namaDepan} />
        <InfoRow label="Nama Belakang" value={namaBelakang} />
        <InfoRow label="Tanggal Lahir" value={tanggalLahir} />
        <InfoRow label="Jenis Kelamin" value={jenisKelamin} />
        <InfoRow label="Tinggi Badan" value={tinggiBadan} />
        <InfoRow label="Berat Badan" value={beratBadan} />
      </div>
    </InfoCard>
  );
}
