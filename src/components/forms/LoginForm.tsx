'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulasi API call - ganti dengan logic authentication Anda
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect ke dashboard setelah login berhasil
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Logo */}
      <div className="lg:hidden mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-blue-600">cybers blitz</span>
        </div>
        <p className="text-sm text-gray-600">nusantara</p>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk</h1>
        <p className="text-gray-600">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Masuk...' : 'Login'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}