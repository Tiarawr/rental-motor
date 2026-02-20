"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-gray-900 text-white transform transition-transform duration-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-gray-800">
          <Link
            href="/admin"
            className="text-sm font-bold tracking-tight text-white"
          >
            Jogja Rentalan<span className="text-yellow-500">.</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === "/admin" ||
              pathname?.startsWith("/admin/motorcycles")
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
          >
            <Bike size={18} />
            Kelola Motor
          </Link>
        </nav>

        <div className="p-3 border-t border-gray-800">
          <Link
            href="/"
            className="block text-center text-xs text-gray-500 hover:text-gray-300 transition-colors py-2"
          >
            ← Kembali ke Website
          </Link>
        </div>
      </aside>
    </>
  );
}
