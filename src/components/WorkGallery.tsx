import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CategoryId, PhotoWork } from '../types';
import { CATEGORIES } from '../data/portfolio';

interface WorkGalleryProps {
  works: PhotoWork[];
  onSelectPhoto: (photo: PhotoWork, index: number, list: PhotoWork[]) => void;
  onOpenEditor: () => void;
  isOwner?: boolean;
}

export default function WorkGallery({ works, onSelectPhoto, onOpenEditor, isOwner = false }: WorkGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('ALL');

  const filteredWorks = useMemo(() => {
    if (activeCategory === 'ALL') {
      return works;
    }
    return works.filter((item) => item.category === activeCategory);
  }, [activeCategory, works]);

  return (
    <section
      id="work"
      className="pt-24 sm:pt-32 pb-24 sm:pb-36 px-6 sm:px-10 max-w-7xl mx-auto"
      aria-label="Selected Works Portfolio"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E5DF] pb-8 mb-12 sm:mb-16 gap-6">
        <div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#787672] block mb-2 font-medium">
            PORTFOLIO
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.15em] uppercase text-[#141414]">
              SELECTED WORKS
            </h2>
          </div>
        </div>

        {/* Category Filters */}
        <div
          className="mt-2 md:mt-0 flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8 text-xs tracking-[0.2em] uppercase font-medium"
          role="tablist"
          aria-label="Filter works by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-${cat.id.toLowerCase()}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative py-1 transition-colors duration-300 cursor-pointer focus:outline-none ${
                  isActive ? 'text-[#141414]' : 'text-[#787672] hover:text-[#141414]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#141414]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Natural Masonry Photography Gallery */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-8">
          {filteredWorks
            .filter((_, i) => i % 3 === 0)
            .map((work, colIndex) => renderPhotoCard(work, colIndex * 3))}
        </div>
        {/* Column 2 */}
        <div className="flex flex-col gap-8">
          {filteredWorks
            .filter((_, i) => i % 3 === 1)
            .map((work, colIndex) => renderPhotoCard(work, colIndex * 3 + 1))}
        </div>
        {/* Column 3 */}
        <div className="flex flex-col gap-8">
          {filteredWorks
            .filter((_, i) => i % 3 === 2)
            .map((work, colIndex) => renderPhotoCard(work, colIndex * 3 + 2))}
        </div>
      </div>

      {/* Tablet & Mobile Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6 sm:gap-8 items-start">
        <div className="flex flex-col gap-6 sm:gap-8">
          {filteredWorks
            .filter((_, i) => i % 2 === 0)
            .map((work, colIndex) => renderPhotoCard(work, colIndex * 2))}
        </div>
        <div className="flex flex-col gap-6 sm:gap-8">
          {filteredWorks
            .filter((_, i) => i % 2 === 1)
            .map((work, colIndex) => renderPhotoCard(work, colIndex * 2 + 1))}
        </div>
      </div>
    </section>
  );

  function renderPhotoCard(work: PhotoWork, originalIndex: number) {
    return (
      <motion.div
        key={work.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer w-full"
        onClick={() => onSelectPhoto(work, originalIndex, filteredWorks)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPhoto(work, originalIndex, filteredWorks);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Lihat foto ${work.title}`}
      >
        {/* Image Box - Natural Height according to uploaded image */}
        <div className="relative w-full overflow-hidden bg-[#E8E5DF]/30 rounded-none border border-[#E8E5DF]/40 transition-all duration-500 group-hover:border-[#141414]/20 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <img
            src={work.image}
            alt={work.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-auto block object-cover filter contrast-[1.01] transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          {/* Subtle hover scrim */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />

          {/* Category Tag pill on hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-[#FAF8F5]/95 backdrop-blur-md text-[#141414] text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-medium shadow-sm">
              {work.categoryLabel}
            </span>
          </div>
        </div>

        {/* Editorial Caption Below Image */}
        <div className="mt-3.5 flex items-baseline justify-between px-0.5">
          <div>
            <h3 className="text-sm sm:text-base font-normal tracking-wide text-[#141414] group-hover:text-[#787672] transition-colors duration-300">
              {work.title}
            </h3>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#787672] mt-0.5 font-normal">
              {work.categoryLabel} {work.location ? `— ${work.location}` : ''}
            </p>
          </div>
          {work.year && (
            <span className="text-[11px] text-[#787672]/70 font-mono tracking-wider ml-2 shrink-0">
              {work.year}
            </span>
          )}
        </div>
      </motion.div>
    );
  }
}
