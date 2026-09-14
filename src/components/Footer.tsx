import { ArrowUp, SlidersHorizontal, Lock, Unlock } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolio';

interface FooterProps {
  onOpenEditor?: () => void;
  isOwner?: boolean;
  onOpenAuth?: () => void;
  onLock?: () => void;
}

export default function Footer({
  onOpenEditor,
  isOwner = false,
  onOpenAuth,
  onLock,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className="py-12 sm:py-16 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#787672] tracking-[0.2em] uppercase"
    >
      <div className="flex items-center gap-3">
        <span>&copy; 2026 {PROFILE_DATA.vendorName} &mdash; {PROFILE_DATA.name}</span>
        
        {/* Discreet Owner Access Trigger */}
        {!isOwner && onOpenAuth && (
          <button
            id="owner-login-btn"
            onClick={onOpenAuth}
            className="text-[10px] lowercase tracking-normal text-[#A8A59F] hover:text-[#141414] transition-colors flex items-center gap-1 cursor-pointer font-sans normal-case ml-2"
            title="Akses Pemilik Portfolio (PIN) / Shortcut: Shift + E"
          >
            <Lock className="w-3 h-3 stroke-[1.5]" />
            <span className="opacity-75 hover:opacity-100">owner</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        {isOwner && (
          <div className="flex items-center gap-3">
            {onOpenEditor && (
              <button
                id="footer-manage-photos-btn"
                onClick={onOpenEditor}
                className="flex items-center space-x-1.5 text-[#141414] hover:text-[#787672] transition-colors cursor-pointer focus:outline-none"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Kelola Galeri Foto</span>
              </button>
            )}

            {onLock && (
              <button
                id="footer-lock-owner-btn"
                onClick={onLock}
                className="flex items-center space-x-1 text-red-600/80 hover:text-red-700 transition-colors cursor-pointer text-[10px] tracking-[0.15em]"
                title="Kunci kembali panel pemilik"
              >
                <Unlock className="w-3 h-3" />
                <span>(KUNCI)</span>
              </button>
            )}
          </div>
        )}

        <a
          id="footer-instagram-link"
          href={PROFILE_DATA.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#141414] transition-colors focus:outline-none"
        >
          Instagram
        </a>

        <button
          id="footer-scroll-top-btn"
          onClick={scrollToTop}
          className="flex items-center space-x-1.5 hover:text-[#141414] transition-colors cursor-pointer focus:outline-none"
          aria-label="Back to top of page"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>
    </footer>
  );
}
