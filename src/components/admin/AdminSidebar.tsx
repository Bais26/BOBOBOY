'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  UserMinusIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const adminMenuItems = [
  { icon: HomeIcon, label: 'Home', href: '/admin/dashboard' },
  { icon: UsersIcon, label: 'Management Karyawan', href: '/admin/karyawan' },
  { 
    icon: UserMinusIcon, label: 'Management Absensi', href: '/admin/rekap',
  },
  { 
    icon: CalendarIcon, 
    label: 'Jadwal Kerja', 
    href: '/admin/jadwal',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-600">cybers blitz</span>
          <span className="text-sm text-gray-600 tracking-wide">nusantara</span>
        </div>
        <div className="mt-3 px-3 py-1.5 bg-blue-100 rounded-md">
          <span className="text-xs font-semibold text-blue-700">ADMIN PANEL</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <div key={item.label} className="mb-1">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </div>
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
