import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  AlertCircle, 
  GraduationCap, 
  FileText, 
  Inbox,
  Loader2
} from 'lucide-react';

// ==========================================
// 1. KONFIGURASI API GOOGLE APPS SCRIPT
// ==========================================
// PENTING: Ganti nilai di bawah ini dengan SCRIPT_URL milik Anda dari Tahap 1.4
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuL9ZGGBbrB1T5mx7iqB33Uskeu06uuhQVBdjMALLqAYkBuNcJOLv7mviwym6ULcXR/exec';
// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi Fetch Events (Bisa pakai Real API atau Mock API)
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        if (SCRIPT_URL) {
          // REAL API dari GAS
          const res = await fetch(`${SCRIPT_URL}?action=getEvents`);
          const json = await res.json();
          if (json.success) setEvents(json.data);
          else setError("Gagal memuat daftar kegiatan dari server.");
        } else {
          // MOCK API (Untuk simulasi)
          setTimeout(() => {
            setEvents(MOCK_EVENTS);
            setIsLoadingEvents(false);
          }, 800);
          return; // Skip set loading false di bawah
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan.");
      } finally {
        if (SCRIPT_URL) setIsLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  // Fungsi Fetch Data Peserta
  useEffect(() => {
    if (!selectedEvent) {
      setParticipants([]);
      return;
    }

    const loadData = async () => {
      setIsLoadingData(true);
      setError(null);
      setSearchQuery('');
      
      try {
        if (SCRIPT_URL) {
          // REAL API dari GAS
          const res = await fetch(`${SCRIPT_URL}?action=getData&event=${encodeURIComponent(selectedEvent)}`);
          const json = await res.json();
          if (json.success) setParticipants(json.data);
          else setError("Gagal memuat data peserta.");
        } else {
          // MOCK API (Untuk simulasi)
          setTimeout(() => {
            setParticipants(MOCK_DATA[selectedEvent] || []);
            setIsLoadingData(false);
          }, 1200);
          return;
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan saat mengambil data.");
      } finally {
        if (SCRIPT_URL) setIsLoadingData(false);
      }
    };

    loadData();
  }, [selectedEvent]);

  // Live Search Logic (Optimistic Filter)
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const query = searchQuery.toLowerCase();
    return participants.filter(p => 
      p.nama.toLowerCase().includes(query) || 
      (p.instansi && p.instansi.toLowerCase().includes(query))
    );
  }, [participants, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://sipandusd.disdikbudtabalong.id/tabalong-smart.png" 
              alt="Logo Tabalong" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900 hidden sm:block">
                Portal Layanan Sertifikat Elektronik
              </h1>
              <h1 className="font-bold text-lg leading-tight text-slate-900 sm:hidden">
                Sertifikat SD
              </h1>
              <p className="text-xs text-slate-500 font-medium">Bidang Pembinaan SD - Disdikbud Tabalong</p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 relative z-10 text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-blue-200 mb-5 opacity-90" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
            Portal Unduh Sertifikat
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-medium">
            Layanan mandiri pengunduhan sertifikat kegiatan yang diselenggarakan oleh <br className="hidden md:block" />
            <span className="text-white font-semibold">Bidang Pembinaan SD - Dinas Pendidikan dan Kebudayaan Kab. Tabalong</span>.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-12">
        
        {/* DISCLAIMER BOX */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-amber-800 font-semibold text-sm mb-1">Informasi Penting</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              Nama dan detail yang tertera pada sertifikat diisi secara otomatis oleh sistem berdasarkan data yang Bapak/Ibu masukkan saat registrasi. Mohon pengertiannya bahwa panitia tidak dapat memproses revisi apabila terdapat kesalahan ejaan (typo) dari isian awal tersebut.
            </p>
          </div>
        </div>

        {/* CONTROLS SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Event Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="event-select" className="block text-sm font-medium text-slate-700">
                Pilih Event / Kegiatan
              </label>
              <div className="relative">
                <select
                  id="event-select"
                  className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border appearance-none bg-white text-slate-700 shadow-sm"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  disabled={isLoadingEvents}
                >
                  <option value="" disabled>-- Silakan Pilih Kegiatan --</option>
                  {isLoadingEvents ? (
                    <option disabled>Memuat daftar kegiatan...</option>
                  ) : (
                    events.map((evt, idx) => (
                      <option key={idx} value={evt}>{evt}</option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  {isLoadingEvents ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label htmlFor="search-input" className="block text-sm font-medium text-slate-700">
                Cari Peserta
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="search-input"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Ketik nama Anda di sini..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!selectedEvent || isLoadingData}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATA SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[300px]">
          
          {/* Default State (No Event Selected) */}
          {!selectedEvent && !isLoadingData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Belum ada kegiatan yang dipilih</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                Silakan pilih event atau kegiatan pada dropdown di atas untuk melihat daftar penerima sertifikat.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white z-10">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => setSelectedEvent('')}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Reset Pilihan
              </button>
            </div>
          )}

          {/* Data Table */}
          {selectedEvent && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                      No
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Nama Peserta & Instansi
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 relative">
                  
                  {/* Section Loading (Skeleton) */}
                  {isLoadingData && (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-slate-200 rounded w-6"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="h-9 bg-slate-200 rounded-lg w-32 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Data Rows */}
                  {!isLoadingData && filteredParticipants.length > 0 && (
                    filteredParticipants.map((p, index) => (
                      <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {p.nama}
                          </div>
                          {p.instansi && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {p.instansi}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={p.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Download size={16} />
                            Unduh
                          </a>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Empty State (Not Loading, Event Selected, No Data match) */}
                  {!isLoadingData && participants.length > 0 && filteredParticipants.length === 0 && (
                     <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-sm font-medium text-slate-900">Pencarian Tidak Ditemukan</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Tidak ada peserta dengan nama "{searchQuery}" pada event ini.
                        </p>
                      </td>
                    </tr>
                  )}

                   {/* Empty State (Not Loading, Event Selected, No Data in Event) */}
                   {!isLoadingData && participants.length === 0 && !error && (
                     <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-sm font-medium text-slate-900">Belum Ada Data</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Sertifikat untuk kegiatan ini belum tersedia atau belum diunggah.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center border-t border-slate-200 mt-12 bg-white">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Bidang Pembinaan SD - Dinas Pendidikan dan Kebudayaan Kab. Tabalong.
        </p>
      </footer>

    </div>
  );
}
