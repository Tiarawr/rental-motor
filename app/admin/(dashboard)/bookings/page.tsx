"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { CheckCircle, XCircle, Search, Filter, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface Booking {
  id: number;
  motorcycle: {
    name: string;
    brand: string;
  };
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  created_at: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      if (response.data.status === "success") {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    if (
      window.confirm(
        `Yakin ingin mengubah status booking menjadi "${newStatus}"?`,
      )
    ) {
      try {
        await api.put(`/bookings/${id}`, { status: newStatus });
        fetchBookings(); // Refresh data
      } catch (error) {
        console.error("Error updating booking status:", error);
        alert("Gagal memperbarui status. Hubungi administrator.");
      }
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.motorcycle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            Menunggu
          </span>
        );
      case "Disetujui":
        return (
          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            Disetujui
          </span>
        );
      case "Selesai":
        return (
          <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            Selesai
          </span>
        );
      case "Ditolak":
        return (
          <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Booking</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola reservasi pelanggan dan ubah status pesanan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari nama pelanggan atau motor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              "All",
              "Menunggu Konfirmasi",
              "Disetujui",
              "Selesai",
              "Ditolak",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                  statusFilter === status
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {status === "All" ? "Semua Status" : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tgl Order
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Motor
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jadwal Sewa
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Harga
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Tidak ada data booking ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {format(parseISO(booking.created_at), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.customer_name}
                      </p>
                      <p className="text-xs text-brand-blue">
                        {booking.customer_phone}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {booking.motorcycle?.name}
                      </span>
                      <br />
                      <span className="text-xs">
                        {booking.motorcycle?.brand}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {format(parseISO(booking.start_date), "dd MMM yyyy", {
                        locale: id,
                      })}{" "}
                      - <br />
                      {format(parseISO(booking.end_date), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Rp {Number(booking.total_price).toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-6 text-center space-x-2 whitespace-nowrap">
                      {booking.status === "Menunggu Konfirmasi" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(booking.id, "Disetujui")
                            }
                            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors tooltip"
                            title="Setujui"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, "Ditolak")}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors tooltip"
                            title="Tolak"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                      {booking.status === "Disetujui" && (
                        <button
                          onClick={() => updateStatus(booking.id, "Selesai")}
                          className="inline-flex items-center justify-center px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-semibold"
                          title="Tandai Selesai"
                        >
                          Selesai
                        </button>
                      )}

                      <button
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-1"
                        title="Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
