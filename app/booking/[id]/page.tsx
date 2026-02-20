"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { safeZodResolver } from "@/lib/zodResolver";
import * as z from "zod";
import { differenceInDays, parseISO } from "date-fns";
import api from "@/lib/axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

const bookingSchema = z
  .object({
    customer_name: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter"),
    customer_phone: z
      .string()
      .min(1, "Nomor HP wajib diisi")
      .min(10, "Nomor HP minimal 10 digit")
      .regex(/^\d+$/, "Nomor HP harus angka"),
    customer_address: z
      .string()
      .min(1, "Alamat wajib diisi")
      .min(5, "Alamat minimal 5 karakter"),
    start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
    end_date: z.string().min(1, "Tanggal kembali wajib diisi"),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
      message: "Tanggal kembali harus setelah tanggal mulai",
      path: ["end_date"],
    },
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  type: string;
  price_per_day: string;
  status: string;
}

type BookingStep = "form" | "summary" | "done";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { toast } = useToast();

  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<BookingStep>("form");
  const [formData, setFormData] = useState<BookingFormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: safeZodResolver(bookingSchema),
  });

  const watchStartDate = watch("start_date");
  const watchEndDate = watch("end_date");

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = parseISO(start);
    const e = parseISO(end);
    return e >= s ? differenceInDays(e, s) + 1 : 0;
  };

  const totalDays = calcDays(
    formData?.start_date || watchStartDate,
    formData?.end_date || watchEndDate,
  );
  const totalPrice = motorcycle
    ? totalDays * Number(motorcycle.price_per_day)
    : 0;

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await api.get(`/motorcycles/${resolvedParams.id}`);
        if (response.data.status === "success") {
          setMotorcycle(response.data.data);
        }
      } catch {
        toast.error("Motor tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    fetchMotorcycle();
  }, [resolvedParams.id]);

  const onSubmit = (data: BookingFormValues) => {
    setFormData(data);
    setStep("summary");
    window.scrollTo(0, 0);
  };

  const handleConfirm = async () => {
    if (!formData || !motorcycle) return;
    setSubmitting(true);

    try {
      await api.post("/bookings", {
        ...formData,
        motorcycle_id: resolvedParams.id,
      });
      toast.success("Booking berhasil disimpan!");
    } catch {
      // Still proceed to WA even if API fails
    }

    const waNumber = "6281234567890";
    const motorName = `${motorcycle.brand} ${motorcycle.name}`;
    const days = totalDays > 0 ? totalDays : 1;
    const price =
      totalPrice > 0 ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "-";
    const waMessage = encodeURIComponent(
      `Halo Jogja Rentalan! 🏍️\n\n` +
        `Saya ingin konfirmasi reservasi:\n\n` +
        `📋 *Detail Booking*\n` +
        `Nama: ${formData.customer_name}\n` +
        `No. HP: ${formData.customer_phone}\n` +
        `Alamat: ${formData.customer_address}\n\n` +
        `🏍️ *Motor*: ${motorName}\n` +
        `📅 *Tanggal*: ${formData.start_date} s/d ${formData.end_date}\n` +
        `⏱️ *Durasi*: ${days} hari\n` +
        `💰 *Total*: ${price}\n\n` +
        `Mohon konfirmasi ketersediaan. Terima kasih! 🙏`,
    );

    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");
    setStep("done");
    setSubmitting(false);
  };

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex justify-center items-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  // --- MOTOR NOT FOUND ---
  if (!motorcycle) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Motor tidak tersedia
        </h2>
        <Link
          href="/motorcycles"
          className="text-sm text-gray-500 hover:text-gray-900 underline"
        >
          Kembali ke daftar motor
        </Link>
      </div>
    );
  }

  // --- STEP 3: DONE ---
  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 flex items-center px-4">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Pesanan Terkirim!
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            WhatsApp sudah terbuka dengan detail pesanan. Kirim pesan untuk
            konfirmasi.
          </p>
          <Link
            href="/motorcycles"
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Kembali ke daftar motor
          </Link>
        </div>
      </div>
    );
  }

  // --- STEP 2: SUMMARY ---
  if (step === "summary" && formData) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setStep("form")}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
          >
            ← Kembali ke formulir
          </button>

          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Ringkasan Pesanan
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Periksa detail sebelum konfirmasi.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            <div className="p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                Motor
              </p>
              <p className="text-base font-bold text-gray-900">
                {motorcycle.name}
              </p>
              <p className="text-sm text-gray-500">
                {motorcycle.brand} · {motorcycle.type}
              </p>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                Data Pemesan
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nama</span>
                  <span className="text-gray-900">
                    {formData.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">No. HP</span>
                  <span className="text-gray-900">
                    {formData.customer_phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alamat</span>
                  <span className="text-gray-900 text-right max-w-[60%]">
                    {formData.customer_address}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                Jadwal
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ambil</span>
                  <span className="text-gray-900">{formData.start_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Kembali</span>
                  <span className="text-gray-900">{formData.end_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Durasi</span>
                  <span className="text-gray-900">{totalDays} hari</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Rp{" "}
                    {Number(motorcycle.price_per_day).toLocaleString("id-ID")} ×{" "}
                    {totalDays} hari
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={`w-full mt-5 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
            {submitting ? "Mengirim..." : "Konfirmasi & Kirim via WhatsApp"}
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            Pembayaran dilakukan saat serah terima kendaraan.
          </p>
        </div>
      </div>
    );
  }

  // --- STEP 1: FORM ---
  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/motorcycles"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
        >
          ← Kembali
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Formulir Reservasi
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {motorcycle.brand} {motorcycle.name} · Rp{" "}
          {Number(motorcycle.price_per_day).toLocaleString("id-ID")}/hari
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("customer_name")}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${errors.customer_name ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              placeholder="Sesuai KTP"
            />
            {errors.customer_name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.customer_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("customer_phone")}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${errors.customer_phone ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              placeholder="08123456789"
            />
            {errors.customer_phone && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.customer_phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Alamat Pengiriman <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("customer_address")}
              rows={2}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none ${errors.customer_address ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              placeholder="Nama hotel / alamat lengkap"
            />
            {errors.customer_address && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {errors.customer_address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Tanggal Ambil <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("start_date")}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${errors.start_date ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              />
              {errors.start_date && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Tanggal Kembali <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={watchStartDate || new Date().toISOString().split("T")[0]}
                {...register("end_date")}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${errors.end_date ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"}`}
              />
              {errors.end_date && (
                <p className="mt-1 text-xs text-red-500">
                  ⚠ {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          {totalDays > 0 && (
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>
                  Rp {Number(motorcycle.price_per_day).toLocaleString("id-ID")}{" "}
                  × {totalDays} hari
                </span>
                <span className="font-bold text-gray-900">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors mt-2"
          >
            Lanjut ke Ringkasan
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
