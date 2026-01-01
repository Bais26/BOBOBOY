'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ClockIcon,
  CalendarIcon, 
  DocumentTextIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const karyawanMenuItems = [
  { icon: HomeIcon, label: 'Dashboard', href: '/karyawan/dashboard' },
  { icon: ClockIcon, label: 'Absensi Saya', href: '/karyawan/absensi' },
  { icon: CalendarIcon, label: 'Jadwal Kerja Saya', href: '/karyawan/jadwal' },
  { icon: DocumentTextIcon, label: 'Riwayat Absensi', href: '/karyawan/riwayat' },
  { icon: UserCircleIcon, label: 'Profil Saya', href: '/karyawan/profile' },
];

export default function KaryawanSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-600">cybers blitz</span>
          <span className="text-sm text-gray-600 tracking-wide">nusantara</span>
        </div>
        <div className="mt-3 px-3 py-1.5 bg-green-100 rounded-md">
          <span className="text-xs font-semibold text-green-700">KARYAWAN</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4">
        {karyawanMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
