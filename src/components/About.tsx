import { motion } from 'motion/react';
import { Camera, Plus } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolio';
import { PhotographerProfile } from '../types';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

interface AboutProps {
  profile?: PhotographerProfile;
  isOwner?: boolean;
  onUpdateProfile?: (updated: Partial<PhotographerProfile>) => void;
}

export default function About({
  profile = PROFILE_DATA,
  isOwner = false,
  onUpdateProfile,
}: AboutProps) {
  const hasPortrait = Boolean(profile.portraitImage && profile.portraitImage.trim().length > 0);

  return (
    <section
      id="about"
      className="py-24 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#E8E5DF]"
      aria-label="About the Studio"
    >
      <div className={`grid grid-cols-1 ${hasPortrait ? 'lg:grid-cols-12 gap-12 lg:gap-16 items-center' : 'max-w-3xl mx-auto'}`}>
        {/* Photographer Portrait Visual (Only displayed if not deleted or if owner adds one) */}
        {hasPortrait ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E5DF]/50 max-w-md mx-auto lg:max-w-none border border-[#E8E5DF]/60">
              <EditableImage
                url={profile.portraitImage}
                alt={`Portrait - ${profile.vendorName}`}
                onSaveUrl={(newUrl) => onUpdateProfile?.({ portraitImage: newUrl })}
                isEditable={isOwner}
                label="Ganti Foto Profil"
                allowDelete={true}
                onDelete={() => onUpdateProfile?.({ portraitImage: '' })}
                className="w-full h-full object-cover object-center filter contrast-[1.02] grayscale-[15%]"
                containerClassName="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.25em] uppercase text-[#FAF8F5]/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 pointer-events-none">
                {profile.vendorName} {profile.name ? `• ${profile.name}` : ''}
              </div>
            </div>
          </motion.div>
        ) : isOwner ? (
          /* Empty state prompt for owner to re-add portrait */
          <div className="lg:col-span-5 border-2 border-dashed border-[#D1CEC7] p-8 text-center bg-[#FAF8F5] mb-8 lg:mb-0">
            <Camera className="w-8 h-8 mx-auto text-[#787672] mb-3 opacity-60" />
            <p className="text-xs uppercase tracking-wider text-[#787672] mb-3">Foto profil sedang tidak ditampilkan</p>
            <button
              type="button"
              onClick={() => {
                const url = prompt('Masukkan URL foto profil atau potret Anda:');
                if (url && url.trim()) {
                  onUpdateProfile?.({ portraitImage: url.trim() });
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Pasang Foto Profil</span>
            </button>
          </div>
        ) : null}

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
              &ldquo;
              <EditableText
                value={profile.bioIntro || ''}
                onSave={(val) => onUpdateProfile?.({ bioIntro: val })}
                isEditable={isOwner}
                multiline={true}
                rows={2}
                label="Kutipan Pembuka Profil (Bio Intro)"
                placeholder="Tulis kutipan pembuka profil..."
              />
              &rdquo;
            </h2>
          </div>

          <div className="space-y-5 text-base sm:text-lg text-[#666460] leading-relaxed font-light">
            <EditableText
              value={profile.bioQuote || ''}
              onSave={(val) => onUpdateProfile?.({ bioQuote: val })}
              isEditable={isOwner}
              multiline={true}
              rows={4}
              label="Narasi & Filosofi Lengkap (Bio Quote)"
              placeholder="Tulis narasi atau cerita studio Anda..."
              tag="p"
            />
          </div>

          {/* Minimalist Details / Notes */}
          <div className="pt-6 border-t border-[#E8E5DF] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs tracking-wider">
            <div>
              <span className="text-[#787672] uppercase text-[10px] tracking-[0.25em] block mb-1">
                APPROACH
              </span>
              <div className="text-[#141414] font-medium leading-relaxed">
                <EditableText
                  value={profile.approachPhilosophy || 'Quiet observation, natural daylight, unhurried candids, and heartfelt intimacy.'}
                  onSave={(val) => onUpdateProfile?.({ approachPhilosophy: val })}
                  isEditable={isOwner}
                  multiline={true}
                  rows={2}
                  label="Pendekatan / Metodologi (Approach)"
                  placeholder="Deskripsikan pendekatan pemotretan..."
                />
              </div>
            </div>
            <div>
              <span className="text-[#787672] uppercase text-[10px] tracking-[0.25em] block mb-1">
                STUDIO &amp; LOCATION
              </span>
              <div className="text-[#141414] font-medium leading-relaxed flex items-center gap-1.5">
                <span>{profile.vendorName} &bull;</span>
                <EditableText
                  value={profile.location || 'Indonesia'}
                  onSave={(val) => onUpdateProfile?.({ location: val })}
                  isEditable={isOwner}
                  label="Lokasi Studio / Basis"
                  placeholder="Lokasi Studio"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
