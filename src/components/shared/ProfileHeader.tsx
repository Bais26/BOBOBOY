import Image from 'next/image';
import StatusBadge from './StatusBadge';
import InfoCard from './InfoCard';
import { UserIcon } from '@heroicons/react/24/outline';

interface ProfileHeaderProps {
  nama: string;
  email: string;
  jabatan: string;
  avatar?: string;
  masukKantor: string;
  status: 'Aktif' | 'Nonaktif';
}

export default function ProfileHeader({
  nama,
  email,
  jabatan,
  avatar,
  masukKantor,
  status,
}: ProfileHeaderProps) {
  return (
    <InfoCard title="Profil" icon={<UserIcon className="w-5 h-5" />} >
    <div className="bg-white rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={nama}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{jabatan}</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{nama}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* Status & Date */}
        <div className="flex gap-8 text-start justify-center">
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Masuk Kantor</p>
            <p className="text-xs font-light text-gray-500">{masukKantor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">STATUS</p>
            <StatusBadge 
              status={status} 
              variant={status === 'Aktif' ? 'aktif' : 'nonaktif'} 
            />
          </div>
        </div>
      </div>
    </div>
    </InfoCard>
  );
}