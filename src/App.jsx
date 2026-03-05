import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  AlertCircle, 
  Award, 
  FileText, 
  Inbox,
  Loader2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// 1. KONFIGURASI API GOOGLE APPS SCRIPT
// ==========================================
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

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

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        if (SCRIPT_URL) {
          const res = await fetch(`${SCRIPT_URL}?action=getEvents`);
          const json = await res.json();
          if (json.success) setEvents(json.data);
          else setError("Gagal memuat daftar kegiatan dari server.");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan.");
      } finally {
        setIsLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

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
          const res = await fetch(`${SCRIPT_URL}?action=getData&event=${encodeURIComponent(selectedEvent)}`);
          const json = await res.json();
          if (json.success) setParticipants(json.data);
          else setError("Gagal memuat data peserta.");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan saat mengambil data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [selectedEvent]);

  const filteredParticipants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return participants;
    return participants.filter(p => 
      p.nama.toLowerCase().includes(query) || 
      (p.instansi && p.instansi.toLowerCase().includes(query))
    );
  }, [participants, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900">
      
      {/* HEADER - GLASSMORPHISM */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Tabalong (Border & Background dihapus) */}
            <img 
              src="https://sipandusd.disdikbudtabalong.id/tabalong-smart.png" 
              alt="Logo Tabalong" 
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="font-bold text-[15px] sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                Portal Layanan Unduh Sertifikat Elektronik
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase">
                Bidang Pembinaan SD - Disdikbud Tabalong
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION - MODERN GRADIENT */}
      <div className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-500 overflow-hidden pt-16 pb-36">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-xl">
            <Award className="h-10 w-10 text-blue-100" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
            Unduh Mandiri <span className="text-cyan-300">Sertifikatmu.</span>
          </h2>
          <p className="text-base md:text-lg text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed">
            Layanan mandiri pengunduhan sertifikat kegiatan yang diselenggarakan Bidang Pembinaan SD - Disdikbud Tabalong.<br />
            Mudah, cepat, dan langsung dari perangkat Anda.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
        
        {/* CONTROLS SECTION */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Event Dropdown */}
            <div className="space-y-2">
              <label htmlFor="event-select" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText size={16} className="text-blue-600" />
                Pilih Kegiatan
              </label>
              <div className="relative group">
                <select
                  id="event-select"
                  className="block w-full pl-4 pr-10 py-3.5 text-sm md:text-base border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl border appearance-none bg-slate-50 hover:bg-slate-100/50 transition-colors text-slate-700 cursor-pointer"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  disabled={isLoadingEvents}
                >
                  <option value="" disabled>-- Daftar Kegiatan Tersedia --</option>
                  {isLoadingEvents ? (
                    <option disabled>Hadangi satumat lah...</option>
                  ) : (
                    events.map((evt, idx) => (
                      <option key={idx} value={evt}>{evt}</option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                  {isLoadingEvents ? <Loader2 className="animate-spin" size={18} /> : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label htmlFor="search-input" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Search size={16} className="text-blue-600" />
                Cari Nama Peserta
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="search-input"
                  className="block w-full rounded-2xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm md:text-base placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-slate-50 hover:bg-slate-100/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Ketik nama lengkap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!selectedEvent || isLoadingData}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Search size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-3 shadow-sm">
          <Sparkles className="text-blue-500 shrink-0 mt-0.5" size={20} />
          <p className="text-blue-800/80 text-sm leading-relaxed font-medium">
            Sertifikat digenerate otomatis berdasarkan data registrasi. Pastikan nama Anda diketik sesuai dengan data awal. Nama dan detail yang tertera pada sertifikat diisi secara otomatis oleh sistem berdasarkan data yang Bapak/Ibu masukkan saat registrasi. Mohon pengertiannya bahwa panitia tidak dapat memproses revisi apabila terdapat kesalahan ejaan (typo) dari isian awal tersebut.
          </p>
        </div>

        {/* DATA SECTION */}
        <div className="relative min-h-[300px]">
          
          {/* Default State */}
          {!selectedEvent && !isLoadingData && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 border-dashed border-2">
              <div className="bg-slate-50 p-5 rounded-full mb-5">
                <Award className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada kegiatan dipilih</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Silakan pilih kegiatan pada menu di atas untuk mulai mencari dan mengunduh sertifikat Anda.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center p-10 text-center bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-700 font-semibold mb-4">{error}</p>
              <button 
                onClick={() => setSelectedEvent('')}
                className="px-6 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Data List */}
          {selectedEvent && (
            <div className="space-y-4">
              
              {/* Tampilan Loading "Hadangi Satumat Lah" */}
              {isLoadingData && (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Hadangi satumat lah...
                  </h3>
                  <p className="mt-2 text-slate-500 text-sm">
                    Sedang menarik data sertifikat dari server.
                  </p>
                </div>
              )}

              {/* Real Data */}
              {!isLoadingData && filteredParticipants.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {filteredParticipants.map((p, index) => (
                    <div 
                      key={p.id || index} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-12 w-12 bg-blue-50 text-blue-600 rounded-full items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {p.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                            {p.nama}
                            <CheckCircle2 size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          {p.instansi && (
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              {p.instansi}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={p.link_sertifikat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-slate-900/10 hover:shadow-blue-600/20 transition-all focus:ring-4 focus:ring-blue-500/20 w-full sm:w-auto"
                      >
                        <Download size={16} />
                        Unduh Sertifikat
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty States */}
              {!isLoadingData && participants.length > 0 && filteredParticipants.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100">
                  <Inbox className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">Nama tidak ditemukan</h3>
                  <p className="mt-2 text-slate-500">
                    Tidak ada peserta dengan nama <span className="font-semibold text-slate-700">"{searchQuery}"</span>. Coba gunakan kata kunci lain.
                  </p>
                </div>
              )}

              {!isLoadingData && participants.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100">
                  <Inbox className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">Data Kosong</h3>
                  <p className="mt-2 text-slate-500">
                    Sertifikat untuk kegiatan ini belum tersedia atau belum diunggah oleh panitia.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} | Bidang Pembinaan SD - Dinas Pendidikan dan Kebudayaan Kab. Tabalong.
          </p>
        </div>
      </footer>

    </div>
  );
}
