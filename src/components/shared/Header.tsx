'use client';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  role: 'admin' | 'karyawan';
}

export default function Header({ role }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {role === 'admin' ? 'Dashboard' : 'Dashboard'}
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              BY
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Bais Yufan</span>
              <span className="text-xs text-gray-500">BaisyuFan@gmail.com</span>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}