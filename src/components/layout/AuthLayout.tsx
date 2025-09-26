import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex-col justify-center items-center p-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-600">cybers blitz</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">nusantara</p>
          </div>

          {/* Illustration */}
          <div className="relative mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mb-2"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-full mb-2"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full mb-2"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello, Friend!</h1>
            <p className="text-gray-600">Welcome Back to Login !!!</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  );
}