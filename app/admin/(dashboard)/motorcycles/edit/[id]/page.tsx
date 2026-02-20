"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    .union([z.string(), z.number()])
    .transform((v) => String(v))
    .refine((v) => v.length >= 1, "Harga wajib diisi")
    .refine((v) => v.length >= 4, "Harga minimal 4 digit"),
  status: z.enum(["available", "unavailable"]),
  description: z.string().optional().nullable(),
});

type MotorcycleFormValues = z.infer<typeof motorcycleSchema>;

export default function EditMotorcycle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MotorcycleFormValues>({
    resolver: zodResolver(motorcycleSchema),
  });

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await api.get(`/motorcycles/${resolvedParams.id}`);
        if (response.data.status === "success") {
          const data = response.data.data;
          reset({
            name: data.name,
            brand: data.brand,
            type: data.type,
            price_per_day: data.price_per_day,
            status: data.status,
            description: data.description || "",
          });
        }
      } catch {
        toast.error("Motor tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    fetchMotorcycle();
  }, [resolvedParams.id, reset]);

  const onSubmit = async (data: MotorcycleFormValues) => {
    setSubmitting(true);

    try {
      const payload = { ...data, image_url: "" };
      const response = await api.put(
        `/motorcycles/${resolvedParams.id}`,
        payload,
      );

      if (response.data.status === "success") {
        toast.success("Motor berhasil diperbarui!");
        router.push("/admin");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menyimpan perubahan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Edit Motor</h1>
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
            />
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Status <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-gray-400">
                Ketersediaan motor saat ini
              </p>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  value="available"
                  {...register("status")}
                  className="accent-gray-900"
                />
                Tersedia
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  value="unavailable"
                  {...register("status")}
                  className="accent-gray-900"
                />
                Tidak Tersedia
              </label>
            </div>
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
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
