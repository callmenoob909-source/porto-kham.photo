import { useState } from 'react';
import { Lock, Sliders, Check, KeyRound, Sparkles, LogOut } from 'lucide-react';

interface LiveAdminBarProps {
  onOpenEditor: () => void;
  onChangePin: () => void;
  onLogout: () => void;
  syncStatus: 'synced' | 'saving' | 'error';
}

export default function LiveAdminBar({
  onOpenEditor,
  onChangePin,
  onLogout,
  syncStatus,
}: LiveAdminBarProps) {

  return (
    <aside
      aria-label="Admin bar status"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#141414]/95 text-[#FAF8F5] backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-2xl border border-white/10 flex items-center gap-3 sm:gap-6 rounded-none text-xs"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Mode Edit Aktif
        </span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-[#A8A59F] border-l border-white/10 pl-4">
        <span>Klik teks atau foto langsung di halaman untuk mengedit.</span>
      </div>

      <div className="flex items-center gap-2 border-l border-white/10 pl-3 sm:pl-4">
        {syncStatus === 'saving' && (
          <span className="text-[10px] text-amber-300 font-mono">Menyimpan...</span>
        )}
        {syncStatus === 'synced' && (
          <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">Tersinkron</span>
        )}

        {/* Change PIN Button */}
        <button
          type="button"
          onClick={onChangePin}
          className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
          title="Ganti PIN Pemilik"
        >
          <KeyRound className="w-3 h-3" />
          <span className="hidden sm:inline">PIN</span>
        </button>

        {/* Advanced Dashboard Modal */}
        <button
          type="button"
          onClick={onOpenEditor}
          className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
          title="Buka Dasbor Lengkap"
        >
          <Sliders className="w-3 h-3" />
          <span className="hidden sm:inline">Dasbor</span>
        </button>

        {/* Exit & Lock */}
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1 text-[10px] uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
          title="Kunci & Selesai Edit"
        >
          <LogOut className="w-3 h-3" />
          <span>Selesai</span>
        </button>
      </div>
    </aside>
  );
}
