"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import api from "@/lib/axios";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  type: string;
  price_per_day: string;
  status: string;
  description: string;
}

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const response = await api.get("/motorcycles");
        if (response.data.status === "success") {
          setMotorcycles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching motorcycles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycles();
  }, []);

  useEffect(() => {
    if (!loading && motorcycles.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".header-anim",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        );

        gsap.fromTo(
          ".editorial-item",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2,
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, motorcycles]);

  return (
    <div
      className={`min-h-screen bg-[#fafafa] pt-32 pb-24 overflow-hidden relative ${poppins.className}`}
      ref={containerRef}
    >
      {/* Subtle Background Accents */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
        {/* Header Section */}
        <div className="mb-24 max-w-3xl">
          <p className="header-anim text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-6">
            Koleksi Premium
          </p>
          <h1 className="header-anim text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-[1.1] text-balance">
            Kendaraan untuk setiap tujuan.
          </h1>
          <p className="header-anim text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
            Kurasi armada terbaik kami dirancang untuk menghadirkan pengalaman
            berkendara yang leluasa dan berkelas. Pilih yang paling sesuai
            dengan gaya mobilitas Anda.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-transparent border border-gray-200 p-8 lg:p-10 shimmer h-[320px]"
              ></div>
            ))
          ) : motorcycles.length > 0 ? (
            motorcycles.map((motor) => (
              <div
                key={motor.id}
                className="editorial-item group relative bg-white/40 backdrop-blur-sm border border-gray-200 p-8 lg:p-10 hover:border-brand-blue hover:scale-[1.02] transition-all duration-700 flex flex-col h-full hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(29,78,216,0.08)]"
              >
                <div className="flex-grow">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-dark/40 uppercase mb-4">
                    {motor.brand}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight leading-tight group-hover:text-brand-blue transition-colors duration-500">
                    {motor.name}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-light mb-8 line-clamp-3">
                    {motor.description ||
                      "Kendaraan mobilitas premium untuk pengalaman perjalanan Anda yang efisien, nyaman, dan senantiasa bergaya."}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 group-hover:border-brand-blue/20 transition-colors duration-500 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em] mb-1.5">
                      Harga / Hari
                    </p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      Rp {Number(motor.price_per_day).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {motor.status === "available" ? (
                    <Link
                      href={`/booking/${motor.id}`}
                      className="text-xs font-semibold tracking-[0.15em] text-brand-dark uppercase hover:text-brand-blue transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:scale-x-0 after:h-[1px] auto after:bg-brand-blue hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-right hover:after:origin-left pb-1"
                    >
                      Sewa
                    </Link>
                  ) : (
                    <span className="text-xs font-medium tracking-[0.15em] text-gray-400 uppercase pb-1">
                      Disewa
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
              <p className="text-xl text-gray-400 font-light tracking-wide">
                Belum ada koleksi kendaraan yang tersedia saat ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
