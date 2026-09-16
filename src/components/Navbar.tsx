import { useState, useEffect } from 'react';
import { Menu, X, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROFILE_DATA } from '../data/portfolio';

interface NavbarProps {
  onNavigate?: (id: string) => void;
  onOpenEditor?: () => void;
  isOwner?: boolean;
  onOpenAuth?: () => void;
}

export default function Navbar({ onNavigate, onOpenEditor, isOwner = false, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret triple-tap logo trigger for owner
  const handleLogoTap = () => {
    if (isOwner) {
      onOpenEditor?.();
      return;
    }
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);
    if (nextCount >= 3) {
      setLogoTapCount(0);
      onOpenAuth?.();
    } else {
      setTimeout(() => setLogoTapCount(0), 1200);
    }
  };

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#FAF8F5]/90 backdrop-blur-md py-4 border-b border-[#E8E5DF]/60'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogoTap();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            id="brand-logo"
            className="group flex flex-col items-start focus:outline-none"
            aria-label={`${PROFILE_DATA.name} - ${PROFILE_DATA.vendorName} Home`}
          >
            <span className="text-base sm:text-lg font-medium tracking-[0.25em] uppercase text-[#141414] transition-opacity duration-300 group-hover:opacity-60">
              {PROFILE_DATA.vendorName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#787672] font-normal -mt-0.5">
              {PROFILE_DATA.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav"
            className="hidden md:flex items-center space-x-10 text-xs tracking-[0.25em] font-medium text-[#141414] uppercase"
            aria-label="Primary Navigation"
          >
            <button
              id="nav-work"
              onClick={() => handleLinkClick('work')}
              className="relative py-1 hover:text-[#787672] transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              WORK
            </button>
            <button
              id="nav-about"
              onClick={() => handleLinkClick('about')}
              className="relative py-1 hover:text-[#787672] transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              ABOUT
            </button>
            <button
              id="nav-contact"
              onClick={() => handleLinkClick('contact')}
              className="relative py-1 hover:text-[#787672] transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              CONTACT
            </button>

            {isOwner && onOpenEditor && (
              <button
                id="nav-manage-photos"
                onClick={onOpenEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] text-[#FAF8F5] hover:bg-[#333] transition-colors text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer"
                title="Kelola & Tambah Foto"
              >
                <PlusCircle className="w-3 h-3" />
                <span>KELOLA FOTO</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-[#141414] hover:text-[#787672] transition-colors focus:outline-none cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#FAF8F5] flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col space-y-8 items-start">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#787672]">
                NAVIGATION
              </span>
              <button
                id="mobile-nav-work"
                onClick={() => handleLinkClick('work')}
                className="text-2xl sm:text-3xl font-serif italic font-normal tracking-wide text-[#141414] hover:text-[#787672] transition-colors text-left"
              >
                Selected Works
              </button>
              <button
                id="mobile-nav-about"
                onClick={() => handleLinkClick('about')}
                className="text-2xl sm:text-3xl font-serif italic font-normal tracking-wide text-[#141414] hover:text-[#787672] transition-colors text-left"
              >
                About Irkham
              </button>
              <button
                id="mobile-nav-contact"
                onClick={() => handleLinkClick('contact')}
                className="text-2xl sm:text-3xl font-serif italic font-normal tracking-wide text-[#141414] hover:text-[#787672] transition-colors text-left"
              >
                Contact &amp; Inquiries
              </button>

              {isOwner && onOpenEditor && (
                <button
                  id="mobile-nav-manage-photos"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenEditor();
                  }}
                  className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-semibold text-[#FAF8F5] bg-[#141414] px-4 py-2.5 hover:bg-[#333] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Kelola / Tambah Foto</span>
                </button>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-[#E8E5DF] flex flex-col space-y-2">
              <span className="text-xs text-[#787672] tracking-wider">
                {PROFILE_DATA.vendorName} — {PROFILE_DATA.name}
              </span>
              <span className="text-xs tracking-[0.2em] uppercase text-[#141414]">
                {PROFILE_DATA.email}
              </span>
              <span className="text-xs tracking-[0.1em] text-[#787672]">
                {PROFILE_DATA.whatsappDisplay}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

