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
    icon: UserMinusIcon, 
    label: 'Management Absensi', 
    href: '/admin/absensi',
    hasSubmenu: true,
    submenu: [
      { label: 'Rekap', href: '/admin/rekap' },
      { label: 'Riwayat', href: '/admin/riwayat' },
    ]
  },
  { 
    icon: CalendarIcon, 
    label: 'Jadwal Kerja', 
    href: '/admin/jadwal',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isOpen = openMenus.includes(item.label);

          return (
            <div key={item.label} className="mb-1">
              {item.hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isOpen && item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                            pathname === subitem.href
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
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
              )}
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
