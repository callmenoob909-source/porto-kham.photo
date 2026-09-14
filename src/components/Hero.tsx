import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { HERO_IMAGE, PROFILE_DATA } from '../data/portfolio';
import { PhotographerProfile } from '../types';

interface HeroProps {
  onViewWork: () => void;
  heroImage?: { url: string; alt: string };
  profile?: PhotographerProfile;
}

export default function Hero({
  onViewWork,
  heroImage = HERO_IMAGE,
  profile = PROFILE_DATA,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-6 sm:px-10 max-w-7xl mx-auto"
      aria-label="Introduction"
    >
      {/* Top Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8E5DF] pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.16em] uppercase text-[#141414]">
            {profile.name}
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.3em] text-[#787672] uppercase font-medium">
            {profile.vendorName} &bull; PHOTOGRAPHY
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 sm:mt-0 max-w-xs sm:text-right"
        >
          <p className="text-xs sm:text-sm text-[#787672] font-normal leading-relaxed tracking-wide">
            {profile.tagline}
          </p>
        </motion.div>
      </div>

      {/* Hero Focal Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="my-6 sm:my-8 relative w-full h-[52vh] sm:h-[62vh] md:h-[68vh] overflow-hidden bg-[#E8E5DF]/50"
      >
        <img
          src={heroImage.url}
          alt={heroImage.alt}
          loading="eager"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98] transition-transform duration-1000 ease-out hover:scale-[1.015]"
        />

        {/* Subtle cinematic vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Caption watermark inside image for editorial feel */}
        <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 text-[#FAF8F5]/90">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase block font-light drop-shadow-sm">
            {profile.vendorName} &mdash; Visual Archive
          </span>
        </div>
      </motion.div>

      {/* Bottom Bar with CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
      >
        <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#787672]">
          Independent Visual Archive
        </span>

        <button
          id="hero-view-work-btn"
          onClick={onViewWork}
          className="group inline-flex items-center space-x-3 text-xs tracking-[0.25em] uppercase font-medium text-[#141414] hover:text-[#787672] transition-colors focus:outline-none cursor-pointer self-start sm:self-auto"
        >
          <span>VIEW WORK</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1 stroke-[1.5]" />
        </button>
      </motion.div>
    </section>
  );
}
