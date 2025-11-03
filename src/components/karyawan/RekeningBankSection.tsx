import { CreditCardIcon } from '@heroicons/react/24/outline';
import InfoCard from '@/components/shared/InfoCard';
import InfoRow from '@/components/shared/InfoRow';

interface RekeningBankSectionProps {
  namaBank: string;
  namaRekening: string;
  nomorRekening: string;
  namaPemilikRekening: string;
}

export default function RekeningBankSection({
  namaBank,
  namaRekening,
  nomorRekening,
  namaPemilikRekening,
}: RekeningBankSectionProps) {
  return (
    <InfoCard title="Data Rekening Bank" icon={<CreditCardIcon className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoRow label="Nama Bank" value={namaBank} />
        <InfoRow label="Nama Rekening" value={namaRekening} />
        <InfoRow label="Nomor Rekening" value={nomorRekening} />
        <div className="md:col-span-3">
          <InfoRow label="Nama Pemilik Rekening" value={namaPemilikRekening} columns={3} />
        </div>
      </div>
    </InfoCard>
  );
}
