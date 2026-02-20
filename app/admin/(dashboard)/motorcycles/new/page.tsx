"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { safeZodResolver } from "@/lib/zodResolver";
import * as z from "zod";
import api from "@/lib/axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

const motorcycleSchema = z.object({
  name: z
    .string()
    .min(1, "Nama motor wajib diisi")
    .min(3, "Nama motor minimal 3 karakter"),
  brand: z
    .string()
    .min(1, "Brand wajib diisi")
    .min(2, "Brand minimal 2 karakter"),
  type: z.string().min(1, "Kategori wajib dipilih").min(2, "Pilih tipe motor"),
  price_per_day: z
    .string()
    .min(1, "Harga wajib diisi")
    .min(4, "Harga minimal 4 digit")
    .regex(/^\d+$/, "Harga harus angka"),
  description: z.string().optional(),
});

type MotorcycleFormValues = z.infer<typeof motorcycleSchema>;

export default function NewMotorcycle() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MotorcycleFormValues>({
    resolver: safeZodResolver(motorcycleSchema),
  });

  const onSubmit = async (data: MotorcycleFormValues) => {
    setSubmitting(true);

    try {
      const payload = { ...data, status: "available", image_url: "" };
      const response = await api.post("/motorcycles", payload);

      if (response.data.status === "success") {
        toast.success("Motor berhasil ditambahkan!");
        router.push("/admin");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan motor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Tambah Motor</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nama Motor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.name ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
                placeholder="Contoh: Vario 160 ABS"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("brand")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.brand ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
                placeholder="Contoh: Honda"
              />
              {errors.brand && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.brand.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                {...register("type")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.type ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              >
                <option value="">Pilih tipe</option>
                <option value="Matic">Matic</option>
                <option value="Bebek">Bebek</option>
                <option value="Sport">Sport</option>
                <option value="Maxi Scooter">Maxi Scooter</option>
                <option value="Classic Scooter">Classic Scooter</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Harga per Hari (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                {...register("price_per_day")}
                disabled={submitting}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 ${errors.price_per_day ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
                placeholder="150000"
              />
              {errors.price_per_day && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.price_per_day.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Deskripsi (opsional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              disabled={submitting}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-white resize-none disabled:opacity-50 transition-colors duration-200"
              placeholder="Keterangan singkat..."
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
            <Link
              href="/admin"
              className="px-4 py-2.5 text-sm text-center text-gray-600 hover:text-gray-900 transition-colors rounded-lg border border-gray-200 sm:border-0"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
