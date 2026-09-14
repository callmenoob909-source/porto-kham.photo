import { useEffect, useRef, useState, useCallback, type TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoWork } from '../types';

interface PhotoLightboxProps {
  isOpen: boolean;
  activePhoto: PhotoWork | null;
  currentIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PhotoLightbox({
  isOpen,
  activePhoto,
  currentIndex,
  totalPhotos,
  onClose,
  onNext,
  onPrev,
}: PhotoLightboxProps) {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setDirection(1);
        onNext();
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        onPrev();
      }
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Ensure it was a horizontal swipe rather than vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setDirection(1);
        onNext();
      } else {
        setDirection(-1);
        onPrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !activePhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="photo-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-[#0B0B0B]/96 backdrop-blur-md flex flex-col justify-between select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo viewer: ${activePhoto.title}`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 text-[#E4E2DD]">
          <div className="text-xs tracking-[0.25em] uppercase font-mono text-[#A1A1AA]">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
          </div>

          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 -mr-2 text-[#E4E2DD] hover:text-white transition-colors cursor-pointer focus:outline-none"
            aria-label="Close photo viewer"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Center Image Stage with Navigation */}
        <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
          {/* Previous Arrow Button */}
          <button
            id="lightbox-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              setDirection(-1);
              onPrev();
            }}
            className="absolute left-4 sm:left-8 z-20 p-3 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer focus:outline-none"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.25]" />
          </button>

          {/* Active Photo with smooth fade & subtle slide transition */}
          <div
            className="relative max-w-[92vw] max-h-[78vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activePhoto.id}
                src={activePhoto.image}
                alt={activePhoto.alt}
                initial={{ opacity: 0, x: direction * 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -40, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
                className="max-h-[76vh] sm:max-h-[80vh] max-w-[88vw] sm:max-w-[82vw] object-contain shadow-2xl"
              />
            </AnimatePresence>
          </div>

          {/* Next Arrow Button */}
          <button
            id="lightbox-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              setDirection(1);
              onNext();
            }}
            className="absolute right-4 sm:right-8 z-20 p-3 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer focus:outline-none"
            aria-label="Next photo"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.25]" />
          </button>
        </div>

        {/* Bottom Minimalist Caption */}
        <div className="px-6 sm:px-10 py-5 text-center text-[#E4E2DD]">
          <h4 className="text-sm sm:text-base font-serif italic tracking-wide text-[#FAF8F5]">
            {activePhoto.title}
          </h4>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#A1A1AA] mt-0.5">
            {activePhoto.categoryLabel} {activePhoto.location ? `— ${activePhoto.location}` : ''}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
