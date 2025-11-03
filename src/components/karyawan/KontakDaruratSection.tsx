import { PhoneIcon } from '@heroicons/react/24/outline';
import InfoCard from '@/components/shared/InfoCard';
import InfoRow from '@/components/shared/InfoRow';

interface KontakDaruratSectionProps {
  nama: string;
  hubungan: string;
  nomorTelepon: string;
}

export default function KontakDaruratSection({
  nama,
  hubungan,
  nomorTelepon,
}: KontakDaruratSectionProps) {
  return (
    <InfoCard title="Kontak Darurat" icon={<PhoneIcon className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoRow label="Nama" value={nama} />
        <InfoRow label="Hubungan" value={hubungan} />
        <InfoRow label="Nomor Telepon" value={nomorTelepon} />
      </div>
    </InfoCard>
  );
}
