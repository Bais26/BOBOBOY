"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "../ui/Alert";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning";
    message: string;
    showResend?: boolean;
  } | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const response = await api.post("/v1/auth/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;

      console.log("✅ Login berhasil");
      console.log("User:", user);
      console.log("Token:", access_token ? "Ada" : "Tidak ada");

      // ✅ Set cookies dengan proper options
      // max-age=86400 = 24 jam
      const cookieOptions = "path=/; max-age=86400; SameSite=Lax";
      
      document.cookie = `access_token=${access_token}; ${cookieOptions}`;
      document.cookie = `role=${user.role}; ${cookieOptions}`;
      document.cookie = `user_id=${user.id}; ${cookieOptions}`;
      document.cookie = `user_email=${user.email}; ${cookieOptions}`;

      console.log("✅ Cookies berhasil di-set");
      
      // ✅ Verify cookies tersimpan
      const savedToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];
      
      console.log("🔍 Verify token di cookies:", savedToken ? "Ada" : "TIDAK ADA!");

      if (!savedToken) {
        console.error("❌ Token tidak tersimpan di cookies!");
        throw new Error("Failed to save authentication token");
      }

      // ✅ IMPORTANT: Tunggu sebentar agar cookies ter-set dengan baik
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("🚀 Redirecting to dashboard...");

      // Redirect berdasarkan role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "karyawan") {
        router.push("/karyawan/dashboard");
      } else {
        router.push("/login");
      }

      // ✅ Force refresh untuk ensure cookies loaded
      setTimeout(() => {
        window.location.reload();
      }, 300);

    } catch (error: any) {
      console.error("❌ Login failed:", error?.response?.data || error);

      const message = error?.response?.data?.detail || "";

      if (message === "Email belum diverifikasi") {
        setAlert({
          variant: "warning",
          message: "Email belum diverifikasi.",
          showResend: true,
        });
      } else {
        setAlert({
          variant: "error",
          message: message || error.message || "Email atau password salah.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      await api.post("/v1/auth/resend-verification", { email });

      setAlert({
        variant: "success",
        message: "Email verifikasi berhasil dikirim ulang. Silakan cek email.",
      });
    } catch (error: any) {
      setAlert({
        variant: "error",
        message: "Gagal mengirim ulang email verifikasi.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full">
      <div className="lg:hidden mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-32 h-32 rounded-lg flex items-center justify-center">
            <img src="/assets/logo.png" alt="cbn logo" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk</h1>
        <p className="text-gray-600">
          Selamat datang kembali! Silakan masuk ke akun Anda.
        </p>
      </div>

      {alert && (
        <Alert variant={alert.variant} title={alert.message}>
          {alert.showResend && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-sm font-medium underline hover:opacity-80"
              >
                {isResending
                  ? "Mengirim ulang..."
                  : "Kirim ulang email verifikasi"}
              </button>
            </div>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-white" />
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}