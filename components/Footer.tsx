"use client";

import Link from "next/link";
import { Bike } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-24 pb-12 mt-auto">
      <div className="mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-16 mb-20">
          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link
              href="/"
              className="flex items-center mb-6 text-white group w-max"
            >
              <span className="text-2xl font-bold tracking-tighter">
                Jogja Rentalan<span className="text-yellow-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 font-light pr-4 max-w-sm">
              Menghadirkan pengalaman mobilitas premium dengan armada kendaraan
              pilihan. Solusi perjalanan elegan dan tanpa hambatan di kota Anda.
            </p>
          </div>

          <div className="md:col-span-1 lg:col-span-2 hidden md:block"></div>

          {/* Navigasi */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white tracking-[0.15em] uppercase mb-6">
              Navigasi
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/motorcycles"
                  className="text-sm hover:text-white transition-colors"
                >
                  Koleksi Motor
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm hover:text-white transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm hover:text-white transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white tracking-[0.15em] uppercase mb-6">
              Kontak
            </h3>
            <div className="space-y-4 text-sm font-light">
              <p>
                Jl. Jendral Sudirman No. 123
                <br />
                Jakarta Pusat, Indonesia
              </p>
              <p className="pt-2">
                <a
                  href="tel:+6281234567890"
                  className="hover:text-white transition-colors"
                >
                  +62 812 3456 7890
                </a>
              </p>
              <p>
                <a
                  href="mailto:halo@rentalmotorku.com"
                  className="hover:text-white transition-colors"
                >
                  halo@rentalmotorku.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-gray-500 font-light">
            &copy; {new Date().getFullYear()} Jogja Rentalan. Semua hak milik
            dilindungi.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-[13px] text-gray-500 hover:text-white transition-colors"
            >
              Privasi
            </Link>
            <Link
              href="#"
              className="text-[13px] text-gray-500 hover:text-white transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
