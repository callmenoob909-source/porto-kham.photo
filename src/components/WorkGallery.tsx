import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
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
            {isOwner && onOpenEditor && (
              <button
                id="manage-photos-gallery-btn"
                onClick={onOpenEditor}
                className="inline-flex items-center gap-2 border border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-[#FAF8F5] px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer"
                title="Tambah foto baru atau kelola galeri"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kelola / Tambah Foto</span>
              </button>
            )}
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

      {/* Editorial Photography Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work, index) => {
            // Editorial layout logic based on index and orientation
            // Creates an asymmetric rhythmic magazine layout
            const patternIndex = index % 5;
            let colSpan = 'md:col-span-6';
            let aspectClass = 'aspect-[3/4]';

            if (work.aspectRatio === 'landscape') {
              if (patternIndex === 0 || patternIndex === 3) {
                colSpan = 'md:col-span-8';
                aspectClass = 'aspect-[16/10] sm:aspect-[16/9]';
              } else {
                colSpan = 'md:col-span-6';
                aspectClass = 'aspect-[4/3]';
              }
            } else {
              // portrait
              if (patternIndex === 1 || patternIndex === 4) {
                colSpan = 'md:col-span-4';
                aspectClass = 'aspect-[3/4]';
              } else if (patternIndex === 2) {
                colSpan = 'md:col-span-6';
                aspectClass = 'aspect-[4/5]';
              } else {
                colSpan = 'md:col-span-4';
                aspectClass = 'aspect-[2/3]';
              }
            }

            return (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`${colSpan} group cursor-pointer`}
                onClick={() => onSelectPhoto(work, index, filteredWorks)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPhoto(work, index, filteredWorks);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View photo ${work.title}`}
              >
                {/* Image Box */}
                <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#E8E5DF]/40`}>
                  <img
                    src={work.image}
                    alt={work.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] filter contrast-[1.01]"
                  />
                  {/* Subtle hover scrim */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />

                  {/* Category Tag pill on mobile or hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#FAF8F5]/90 backdrop-blur-sm text-[#141414] text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
                      {work.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Editorial Caption Below Image */}
                <div className="mt-3.5 flex items-baseline justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-normal tracking-wider text-[#141414] group-hover:text-[#787672] transition-colors duration-300">
                      {work.title}
                    </h3>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-[#787672] mt-0.5">
                      {work.categoryLabel} {work.location ? `— ${work.location}` : ''}
                    </p>
                  </div>
                  {work.year && (
                    <span className="text-[11px] text-[#787672]/70 font-mono tracking-wider">
                      {work.year}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
