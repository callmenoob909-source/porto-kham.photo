import { motion } from 'motion/react';
import { PROFILE_DATA } from '../data/portfolio';
import { PhotographerProfile } from '../types';

interface AboutProps {
  profile?: PhotographerProfile;
}

export default function About({ profile = PROFILE_DATA }: AboutProps) {
  const hasPortrait = Boolean(profile.portraitImage && profile.portraitImage.trim().length > 0);

  return (
    <section
      id="about"
      className="py-24 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#E8E5DF]"
      aria-label="About the Studio"
    >
      <div className={`grid grid-cols-1 ${hasPortrait ? 'lg:grid-cols-12 gap-12 lg:gap-16 items-center' : 'max-w-3xl mx-auto'}`}>
        {/* Photographer Portrait Visual (Only displayed if not deleted) */}
        {hasPortrait && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E5DF]/50 max-w-md mx-auto lg:max-w-none border border-[#E8E5DF]/60">
              <img
                src={profile.portraitImage}
                alt={`Portrait - ${profile.vendorName}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter contrast-[1.02] grayscale-[15%]"
              />
              <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.25em] uppercase text-[#FAF8F5]/90 bg-black/40 backdrop-blur-sm px-2.5 py-1">
                {profile.vendorName} {profile.name ? `• ${profile.name}` : ''}
              </div>
            </div>
          </motion.div>
        )}

        {/* Narrative & Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`${hasPortrait ? 'lg:col-span-7' : 'w-full'} flex flex-col justify-center space-y-8`}
        >
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#787672] block mb-3 font-medium">
              ABOUT &bull; {profile.vendorName}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#141414] leading-tight font-serif italic">
              &ldquo;{profile.bioIntro}&rdquo;
            </h2>
          </div>

          <div className="space-y-5 text-base sm:text-lg text-[#666460] leading-relaxed font-light">
            <p>
              {profile.bioQuote}
            </p>
          </div>

          {/* Minimalist Details / Notes */}
          <div className="pt-6 border-t border-[#E8E5DF] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs tracking-wider">
            <div>
              <span className="text-[#787672] uppercase text-[10px] tracking-[0.25em] block mb-1">
                APPROACH
              </span>
              <p className="text-[#141414] font-medium leading-relaxed">
                {profile.approachPhilosophy || 'Quiet observation, natural daylight, unhurried candids, and heartfelt intimacy.'}
              </p>
            </div>
            <div>
              <span className="text-[#787672] uppercase text-[10px] tracking-[0.25em] block mb-1">
                STUDIO &amp; LOCATION
              </span>
              <p className="text-[#141414] font-medium leading-relaxed">
                {profile.vendorName} &bull; {profile.location}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
