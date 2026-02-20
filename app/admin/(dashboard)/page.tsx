"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  type: string;
  price_per_day: string;
  status: string;
}

export default function AdminDashboard() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchMotorcycles = async () => {
    try {
      const response = await api.get("/motorcycles");
      if (response.data.status === "success") {
        setMotorcycles(response.data.data);
      }
    } catch {
      toast.error("Gagal memuat data motor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/motorcycles/${deleteId}`);
      toast.success("Motor berhasil dihapus.");
      fetchMotorcycles();
    } catch {
      toast.error("Gagal menghapus motor.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredMotorcycles = motorcycles.filter(
    (motor) =>
      motor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motor.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Motor</h1>
        <Link
          href="/admin/motorcycles/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors w-full sm:w-auto"
        >
          <Plus size={16} />
          Tambah Motor
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari motor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-sm transition-colors duration-200"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Mobile cards + Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Nama
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Brand
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Tipe
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Harga/Hari
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredMotorcycles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm text-gray-400"
                  >
                    Belum ada motor.
                  </td>
                </tr>
              ) : (
                filteredMotorcycles.map((motor) => (
                  <tr
                    key={motor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {motor.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {motor.brand}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {motor.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      Rp {Number(motor.price_per_day).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${motor.status === "available" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                      >
                        {motor.status === "available" ? "Tersedia" : "Disewa"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        href={`/admin/motorcycles/edit/${motor.id}`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(motor.id)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ) : filteredMotorcycles.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Belum ada motor.
            </p>
          ) : (
            filteredMotorcycles.map((motor) => (
              <div
                key={motor.id}
                className="p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {motor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {motor.brand} · {motor.type}
                  </p>
                  <p className="text-xs text-gray-900 font-medium mt-0.5">
                    Rp {Number(motor.price_per_day).toLocaleString("id-ID")}
                    /hari
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/motorcycles/edit/${motor.id}`}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    onClick={() => setDeleteId(motor.id)}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Total: {motorcycles.length} motor
      </p>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Hapus Motor?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Motor akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 ${deleting ? "opacity-60" : ""}`}
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
