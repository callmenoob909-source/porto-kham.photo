import { motion } from 'motion/react';
import { ArrowUpRight, Mail, MessageCircle, Instagram } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolio';
import { PhotographerProfile } from '../types';
import EditableText from './EditableText';

interface ContactProps {
  profile?: PhotographerProfile;
  isOwner?: boolean;
  onUpdateProfile?: (updated: Partial<PhotographerProfile>) => void;
}

export default function Contact({
  profile = PROFILE_DATA,
  isOwner = false,
  onUpdateProfile,
}: ContactProps) {
  const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(`Inquiry: Photography Collaboration / Session with ${profile.vendorName}`)}`;

  return (
    <section
      id="contact"
      className="py-24 sm:py-36 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#E8E5DF]"
      aria-label="Contact and Inquiries"
    >
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#787672] block font-medium">
            CONTACT &amp; BOOKINGS &bull; {profile.vendorName}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.12em] uppercase text-[#141414] leading-[1.15]">
            <EditableText
              value={profile.contactHeadline || "LET'S CREATE SOMETHING MEANINGFUL."}
              onSave={(val) => onUpdateProfile?.({ contactHeadline: val })}
              isEditable={isOwner}
              label="Judul Utama Ajakan Kontak"
              placeholder="LET'S CREATE SOMETHING MEANINGFUL."
              tag="span"
            />
          </h2>

          <div className="text-base sm:text-lg text-[#666460] font-light leading-relaxed max-w-xl">
            <EditableText
              value={profile.contactDescription || `For wedding, prewedding, portraits, or commercial inquiries with ${profile.vendorName}, feel free to reach out.`}
              onSave={(val) => onUpdateProfile?.({ contactDescription: val })}
              isEditable={isOwner}
              multiline={true}
              rows={3}
              label="Deskripsi Ajakan Kontak"
              placeholder="Tulis deskripsi ajakan kolaborasi..."
              tag="p"
            />
          </div>

          <div className="pt-2">
            <a
              id="contact-get-in-touch-btn"
              href={mailtoUrl}
              className="inline-flex items-center space-x-3 bg-[#141414] text-[#FAF8F5] px-8 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#333333] transition-colors duration-300 focus:outline-none"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
            </a>
          </div>
        </motion.div>

        {/* Direct Channels with Inline Edit Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 pt-10 border-t border-[#E8E5DF] grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {/* Instagram */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <Instagram className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Instagram</span>
            </div>
            {isOwner ? (
              <EditableText
                value={profile.instagramHandle || '@kham.photo'}
                onSave={(val) => onUpdateProfile?.({ instagramHandle: val, instagram: `https://instagram.com/${val.replace('@', '')}` })}
                isEditable={true}
                label="Handle Instagram"
                placeholder="@instagram"
                className="text-sm font-medium text-[#141414]"
              />
            ) : (
              <a
                id="contact-channel-instagram"
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sm font-medium text-[#141414] hover:text-[#787672] transition-colors flex items-center"
              >
                {profile.instagramHandle}
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>WhatsApp</span>
            </div>
            {isOwner ? (
              <EditableText
                value={profile.whatsappDisplay || '+62 812-3456-7890'}
                onSave={(val) => onUpdateProfile?.({ whatsappDisplay: val, whatsapp: `https://wa.me/${val.replace(/[^0-9]/g, '')}` })}
                isEditable={true}
                label="Nomor WhatsApp"
                placeholder="+62 ..."
                className="text-sm font-medium text-[#141414]"
              />
            ) : (
              <a
                id="contact-channel-whatsapp"
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sm font-medium text-[#141414] hover:text-[#787672] transition-colors flex items-center"
              >
                {profile.whatsappDisplay}
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Email</span>
            </div>
            {isOwner ? (
              <EditableText
                value={profile.email || 'hello@khamphoto.com'}
                onSave={(val) => onUpdateProfile?.({ email: val })}
                isEditable={true}
                label="Email Kontak"
                placeholder="email@domain.com"
                className="text-sm font-medium text-[#141414] break-all"
              />
            ) : (
              <a
                id="contact-channel-email"
                href={`mailto:${profile.email}`}
                className="group text-sm font-medium text-[#141414] hover:text-[#787672] transition-colors break-all flex items-center"
              >
                {profile.email}
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
