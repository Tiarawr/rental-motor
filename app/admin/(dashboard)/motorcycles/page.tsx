"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  type: string;
  price_per_day: string;
  status: string;
}

export default function AdminMotorcycles() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus motor ini?")) {
      try {
        await api.delete(`/motorcycles/${id}`);
        fetchMotorcycles();
      } catch (error) {
        console.error("Error deleting motorcycle:", error);
        alert("Gagal menghapus motor.");
      }
    }
  };

  const filteredMotorcycles = motorcycles.filter(
    (motor) =>
      motor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motor.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Motor</h1>
        <Link
          href="/admin/motorcycles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
        >
          <Plus size={16} />
          Tambah Motor
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari motor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                Nama Motor
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
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-gray-400"
                >
                  Memuat...
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
                <tr key={motor.id} className="hover:bg-gray-50">
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
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        motor.status === "available"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
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
                      onClick={() => handleDelete(motor.id)}
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

      <p className="mt-4 text-xs text-gray-400">
        Total: {motorcycles.length} motor
      </p>
    </div>
  );
}
