"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);

    try {
      try {
        await api.get("http://localhost:8000/sanctum/csrf-cookie");
      } catch {}

      const response = await api.post("/login", data);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login berhasil!");
        router.push("/admin");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Email atau password salah.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Jogja Rentalan<span className="text-yellow-500">.</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Login Admin</h2>
          <p className="text-sm text-gray-400">Masukkan kredensial Anda</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.email ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
                placeholder="admin@rental.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("password")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.password ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-black rounded-lg transition-colors mt-2 ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </div>
  );
}
