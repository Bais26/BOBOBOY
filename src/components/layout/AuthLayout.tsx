import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <img src="/assets/logo.png" alt="cbn logo" />
              </div>
            </div>
          </div>
          <div className="relative mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full h-full w-80 flex items-center justify-center">
                <img src="/assets/Brainstorming.png" alt="cbnassets" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hello, Friend!
            </h1>
            <p className="text-gray-600">Welcome Back to Login !!!</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">{children}</div>
      </div>
    </div>
  );
}
