import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ size = 'md', showText = true, className, href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', subtitle: 'text-xs' },
    md: { icon: 'w-8 h-8', text: 'text-xl', subtitle: 'text-sm' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', subtitle: 'text-base' }
  };

  const LogoContent = () => (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('bg-blue-600 rounded-lg flex items-center justify-center', sizes[size].icon)}>
        <svg className={cn('text-white', size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-blue-600', sizes[size].text)}>
            cybers blitz
          </span>
          <span className={cn('text-gray-600', sizes[size].subtitle)}>
            nusantara
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}