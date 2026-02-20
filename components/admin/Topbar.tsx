"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Bell, LogOut, Menu, User } from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      // Ignore errors on logout, just clear local state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/admin/login");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-brand-dark focus:outline-none lg:hidden mr-4"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-brand-blue relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-brand-light flex items-center justify-center text-brand-blue font-bold">
            <User size={18} />
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
