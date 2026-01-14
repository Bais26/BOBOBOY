'use client';
import { BellIcon, ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  role: 'admin' | 'karyawan';
}

interface UserData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone_number?: string;
  address?: string;
  karyawan_detail?: any;
}

export default function Header({ role }: HeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://be-abcenci.vercel.app/api/v1/karyawan/');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        // Ambil data user pertama atau sesuaikan dengan logic authentication Anda
        const currentUser = result.data.find((user: UserData) => user.role === role) || result.data[0];
        setUserData(currentUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    router.push('/admin/profile');
  };

  const handleLogout = () => {
    // Implementasi logout - hapus token, clear session, dll
    localStorage.removeItem('token');
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {role === 'admin' ? 'Dashboard Admin' : 'Dashboard'}
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {userData ? getInitials(userData.full_name) : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {userData?.full_name || 'Loading...'}
                </span>
                <span className="text-xs text-gray-500">
                  {userData?.email || ''}
                </span>
              </div>
              <ChevronDownIcon 
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5 text-gray-400" />
                  <span>Profile</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}