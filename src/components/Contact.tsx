import { motion } from 'motion/react';
import { ArrowUpRight, Mail, MessageCircle, Instagram } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolio';

export default function Contact() {
  const mailtoUrl = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent('Inquiry: Photography Collaboration / Session')}`;

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
            CONTACT &amp; BOOKINGS
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.12em] uppercase text-[#141414] leading-[1.15]">
            LET'S CREATE SOMETHING MEANINGFUL.
          </h2>

          <p className="text-base sm:text-lg text-[#666460] font-light leading-relaxed max-w-xl">
            For collaborations, events, portraits, or simply to say hello, feel free to get in touch.
          </p>

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

        {/* Direct Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 pt-10 border-t border-[#E8E5DF] grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {/* Instagram */}
          <a
            id="contact-channel-instagram"
            href={PROFILE_DATA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col space-y-1 focus:outline-none"
          >
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <Instagram className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Instagram</span>
            </div>
            <span className="text-sm font-medium text-[#141414] group-hover:text-[#787672] transition-colors flex items-center">
              {PROFILE_DATA.instagramHandle}
              <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </a>

          {/* WhatsApp */}
          <a
            id="contact-channel-whatsapp"
            href={PROFILE_DATA.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col space-y-1 focus:outline-none"
          >
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>WhatsApp</span>
            </div>
            <span className="text-sm font-medium text-[#141414] group-hover:text-[#787672] transition-colors flex items-center">
              {PROFILE_DATA.whatsappDisplay}
              <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </a>

          {/* Email */}
          <a
            id="contact-channel-email"
            href={`mailto:${PROFILE_DATA.email}`}
            className="group flex flex-col space-y-1 focus:outline-none"
          >
            <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#787672]">
              <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Email</span>
            </div>
            <span className="text-sm font-medium text-[#141414] group-hover:text-[#787672] transition-colors break-all flex items-center">
              {PROFILE_DATA.email}
              <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
