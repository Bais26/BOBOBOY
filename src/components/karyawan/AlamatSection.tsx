import { MapPinIcon } from '@heroicons/react/24/outline';
import InfoCard from '@/components/shared/InfoCard';
import InfoRow from '@/components/shared/InfoRow';

interface AlamatSectionProps {
  namaAlamat: string;
  namaJalan: string;
  detailAlamat: string;
}

export default function AlamatSection({
  namaAlamat,
  namaJalan,
  detailAlamat,
}: AlamatSectionProps) {
  return (
    <InfoCard title="Alamat" icon={<MapPinIcon className="w-5 h-5" />}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Nama Alamat" value={namaAlamat} />
          <div className="md:col-span-2">
            <InfoRow 
              label="Nama Jalan, Kecamatan, Kota" 
              value={namaJalan}
              columns={3}
            />
          </div>
          <div className="md:col-span-2">
            <InfoRow 
              label="Detail Alamat" 
              value={detailAlamat}
              columns={3}
            />
          </div>
        </div>
      </div>
    </InfoCard>
  );
}
