'use client';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface ExportOption {
  label: string;
  value: 'pdf' | 'excel';
  icon?: string;
}

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel') => void;
}

const exportOptions: ExportOption[] = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'excel' },
];

export default function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            {exportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-sm text-gray-700"
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}