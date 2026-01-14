"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Swal from "sweetalert2";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/v1/auth/register", form);

      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil 🎉",
        text: "Silakan cek email untuk verifikasi akun Anda.",
        confirmButtonText: "Login",
        allowOutsideClick: false,
      });

      router.push("/login");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error?.response?.data?.detail || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="lg:hidden mb-8 text-center">
        <div className="flex justify-center">
          <img src="/assets/logo.png" alt="logo" className="w-32 h-32" />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar</h1>
        <p className="text-gray-600">Buat akun baru untuk melanjutkan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="full_name"
          placeholder="Nama Lengkap"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="confirm_password"
          placeholder="Konfirmasi Password"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
