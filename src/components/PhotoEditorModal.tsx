import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Lock,
  User,
  Compass,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { CategoryId, PhotoWork, PhotographerProfile } from '../types';
import { CATEGORIES } from '../data/portfolio';
import { compressImageFile } from '../utils/imageCompressor';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  works: PhotoWork[];
  onSaveWorks: (works: PhotoWork[]) => void;
  heroImage: { url: string; alt: string };
  onSaveHeroImage: (hero: { url: string; alt: string }) => void;
  profile: PhotographerProfile;
  onSaveProfile: (profile: PhotographerProfile) => void;
  onResetDefaults: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  onLock: () => void;
}

export default function PhotoEditorModal({
  isOpen,
  onClose,
  works,
  onSaveWorks,
  heroImage,
  onSaveHeroImage,
  profile,
  onSaveProfile,
  onResetDefaults,
  currentPin,
  onUpdatePin,
  onLock,
}: PhotoEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'works' | 'branding' | 'export' | 'security'>('works');

  // Form State for Adding / Editing a Photo Work
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoSourceType, setPhotoSourceType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('WEDDING');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('2026');
  const [alt, setAlt] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);

  // Hero & Profile form state
  const [heroUrl, setHeroUrl] = useState(heroImage.url);
  const [profileImgUrl, setProfileImgUrl] = useState(profile.portraitImage);
  const [brandSaved, setBrandSaved] = useState(false);

  // Editable Profile, Approach & Contact form state
  const [vendorName, setVendorName] = useState(profile.vendorName || profile.name || '');
  const [photographerName, setPhotographerName] = useState(profile.name || '');
  const [roleTitle, setRoleTitle] = useState(profile.role || '');
  const [taglineText, setTaglineText] = useState(profile.tagline || '');
  const [bioIntroText, setBioIntroText] = useState(profile.bioIntro || '');
  const [bioQuoteText, setBioQuoteText] = useState(profile.bioQuote || '');
  const [locationText, setLocationText] = useState(profile.location || '');
  const [approachText, setApproachText] = useState(profile.approachPhilosophy || '');
  const [contactHeadlineText, setContactHeadlineText] = useState(profile.contactHeadline || '');
  const [contactDescText, setContactDescText] = useState(profile.contactDescription || '');
  const [emailText, setEmailText] = useState(profile.email || '');
  const [whatsappText, setWhatsappText] = useState(profile.whatsapp || '');
  const [whatsappDisplayText, setWhatsappDisplayText] = useState(profile.whatsappDisplay || '');
  const [instagramText, setInstagramText] = useState(profile.instagram || '');
  const [instagramHandleText, setInstagramHandleText] = useState(profile.instagramHandle || '');

  // Keep profile state synced when profile prop changes
  useEffect(() => {
    setProfileImgUrl(profile.portraitImage);
    setVendorName(profile.vendorName || profile.name || '');
    setPhotographerName(profile.name || '');
    setRoleTitle(profile.role || '');
    setTaglineText(profile.tagline || '');
    setBioIntroText(profile.bioIntro || '');
    setBioQuoteText(profile.bioQuote || '');
    setLocationText(profile.location || '');
    setApproachText(profile.approachPhilosophy || '');
    setContactHeadlineText(profile.contactHeadline || '');
    setContactDescText(profile.contactDescription || '');
    setEmailText(profile.email || '');
    setWhatsappText(profile.whatsapp || '');
    setWhatsappDisplayText(profile.whatsappDisplay || '');
    setInstagramText(profile.instagram || '');
    setInstagramHandleText(profile.instagramHandle || '');
  }, [profile]);

  useEffect(() => {
    setHeroUrl(heroImage.url);
  }, [heroImage]);

  // PIN security form state
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Mohon pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    try {
      setUploadError('');
      const compressedDataUrl = await compressImageFile(file, 1600, 1600, 0.85);
      setImageUrl(compressedDataUrl);
      if (!title) {
        // Auto extract pleasant default title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch {
      setUploadError('Gagal memproses gambar. Coba gunakan file lain.');
    }
  };

  const handleHeroFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 2000, 2000, 0.88);
      setHeroUrl(dataUrl);
    } catch {
      alert('Gagal mengunggah foto hero.');
    }
  };

  const handleProfileFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1200, 1200, 0.85);
      setProfileImgUrl(dataUrl);
    } catch {
      alert('Gagal mengunggah foto profil.');
    }
  };

  const handleStartEdit = (work: PhotoWork) => {
    setEditingId(work.id);
    setImageUrl(work.image);
    setTitle(work.title);
    setCategory(work.category);
    setAspectRatio(work.aspectRatio === 'landscape' ? 'landscape' : 'portrait');
    setLocation(work.location || '');
    setYear(work.year || '2026');
    setAlt(work.alt || '');
    setPhotoSourceType('url');
    // Scroll form to top
    const formEl = document.getElementById('photo-form-box');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setImageUrl('');
    setTitle('');
    setLocation('');
    setYear('2026');
    setAlt('');
    setUploadError('');
  };

  const handleSavePhotoForm = (e: FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setUploadError('Foto belum dipilih atau URL masih kosong.');
      return;
    }
    if (!title.trim()) {
      setUploadError('Judul foto wajib diisi.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === category);
    const categoryLabel = catObj ? catObj.label.charAt(0) + catObj.label.slice(1).toLowerCase() : category;

    if (editingId) {
      // Update existing
      const updated = works.map((w) => {
        if (w.id === editingId) {
          return {
            ...w,
            title: title.trim(),
            category,
            categoryLabel,
            image: imageUrl.trim(),
            aspectRatio,
            orientation: (aspectRatio === 'landscape' ? 'horizontal' : 'vertical') as 'horizontal' | 'vertical',
            year: year.trim(),
            location: location.trim(),
            alt: alt.trim() || `${title} - Foto fotografi oleh Irkham`,
          };
        }
        return w;
      });
      onSaveWorks(updated);
    } else {
      // Add new to top of gallery
      const newPhoto: PhotoWork = {
        id: `work-${Date.now()}`,
        title: title.trim(),
        category,
        categoryLabel,
        image: imageUrl.trim(),
        aspectRatio,
        orientation: aspectRatio === 'landscape' ? 'horizontal' : 'vertical',
        year: year.trim(),
        location: location.trim(),
        alt: alt.trim() || `${title} - Foto fotografi oleh Irkham`,
      };
      onSaveWorks([newPhoto, ...works]);
    }

    handleCancelForm();
  };

  const handleDeletePhoto = (id: string, photoTitle: string) => {
    if (window.confirm(`Yakin ingin menghapus foto "${photoTitle}" dari galeri?`)) {
      const updated = works.filter((w) => w.id !== id);
      onSaveWorks(updated);
      if (editingId === id) {
        handleCancelForm();
      }
    }
  };

  const handleSaveBranding = () => {
    onSaveHeroImage({
      ...heroImage,
      url: heroUrl,
    });
    onSaveProfile({
      ...profile,
      vendorName: vendorName.trim() || profile.vendorName,
      name: photographerName.trim(),
      role: roleTitle.trim() || profile.role,
      tagline: taglineText.trim() || profile.tagline,
      bioIntro: bioIntroText.trim() || profile.bioIntro,
      bioQuote: bioQuoteText.trim() || profile.bioQuote,
      location: locationText.trim() || profile.location,
      approachPhilosophy: approachText.trim(),
      contactHeadline: contactHeadlineText.trim(),
      contactDescription: contactDescText.trim(),
      email: emailText.trim() || profile.email,
      whatsapp: whatsappText.trim() || profile.whatsapp,
      whatsappDisplay: whatsappDisplayText.trim() || whatsappText.trim() || profile.whatsappDisplay,
      instagram: instagramText.trim() || profile.instagram,
      instagramHandle: instagramHandleText.trim() || profile.instagramHandle,
      portraitImage: profileImgUrl,
    });
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2500);
  };

  const handleCopyCode = () => {
    const codeString = `export const WORKS_DATA: PhotoWork[] = ${JSON.stringify(works, null, 2)};`;
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="photo-editor-modal-container"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FAF8F5] text-[#141414] w-full max-w-4xl max-h-[92vh] flex flex-col rounded-none shadow-2xl border border-[#E8E5DF] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#E8E5DF] bg-[#FAF8F5]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672] font-semibold block">
                STUDIO CURATOR PANEL
              </span>
              <h3 className="text-lg sm:text-xl font-medium tracking-wide uppercase text-[#141414]">
                Kelola Foto &amp; Portofolio
              </h3>
            </div>

            <button
              id="close-editor-modal-btn"
              onClick={onClose}
              className="p-2 text-[#787672] hover:text-[#141414] transition-colors cursor-pointer focus:outline-none"
              aria-label="Tutup panel"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E8E5DF] bg-[#F4F2ED] text-xs font-medium tracking-[0.2em] uppercase overflow-x-auto">
            <button
              id="tab-btn-works"
              onClick={() => setActiveTab('works')}
              className={`px-6 py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'works'
                  ? 'border-[#141414] text-[#141414] bg-[#FAF8F5]'
                  : 'border-transparent text-[#787672] hover:text-[#141414]'
              }`}
            >
              Galeri Karya ({works.length} Foto)
            </button>
            <button
              id="tab-btn-branding"
              onClick={() => setActiveTab('branding')}
              className={`px-6 py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'branding'
                  ? 'border-[#141414] text-[#141414] bg-[#FAF8F5]'
                  : 'border-transparent text-[#787672] hover:text-[#141414]'
              }`}
            >
              Profil, About &amp; Kontak
            </button>
            <button
              id="tab-btn-export"
              onClick={() => setActiveTab('export')}
              className={`px-6 py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'export'
                  ? 'border-[#141414] text-[#141414] bg-[#FAF8F5]'
                  : 'border-transparent text-[#787672] hover:text-[#141414]'
              }`}
            >
              Ekspor &amp; Backup
            </button>
            <button
              id="tab-btn-security"
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'border-[#141414] text-[#141414] bg-[#FAF8F5]'
                  : 'border-transparent text-[#787672] hover:text-[#141414]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Keamanan PIN
            </button>
          </div>

          {/* Tab Body Contents */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* ================= TAB 1: GALERI KARYA ================= */}
            {activeTab === 'works' && (
              <>
                {/* Form to Add / Edit */}
                <div id="photo-form-box" className="bg-[#F4F2ED] p-5 sm:p-6 border border-[#E8E5DF]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[#141414] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {editingId ? 'Edit Foto Karya' : 'Tambah Foto Baru ke Galeri'}
                    </h4>
                    {editingId && (
                      <button
                        onClick={handleCancelForm}
                        className="text-xs text-[#787672] hover:text-[#141414] underline cursor-pointer"
                      >
                        Batal Edit / Tambah Baru
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePhotoForm} className="space-y-4">
                    {/* Choose between Direct Upload or URL */}
                    <div className="flex items-center gap-4 text-xs font-medium tracking-wider">
                      <button
                        type="button"
                        onClick={() => setPhotoSourceType('upload')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer ${
                          photoSourceType === 'upload'
                            ? 'bg-[#141414] text-[#FAF8F5] border-[#141414]'
                            : 'bg-white text-[#787672] border-[#E8E5DF]'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload dari HP / Laptop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoSourceType('url')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer ${
                          photoSourceType === 'url'
                            ? 'bg-[#141414] text-[#FAF8F5] border-[#141414]'
                            : 'bg-white text-[#787672] border-[#E8E5DF]'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Input URL Foto
                      </button>
                    </div>

                    {/* Image Input Area */}
                    {photoSourceType === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                          id="file-upload-input"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#D1CEC7] hover:border-[#141414] p-6 text-center cursor-pointer transition-colors bg-white/70 flex flex-col items-center justify-center space-y-2"
                        >
                          <Upload className="w-6 h-6 text-[#787672]" />
                          <span className="text-xs font-medium text-[#141414] tracking-wide">
                            Klik untuk memilih foto dari perangkat Anda
                          </span>
                          <span className="text-[11px] text-[#787672]">
                            Format: JPG, PNG, WEBP (Otomatis dioptimalkan)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          URL Gambar:
                        </label>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... atau link foto Anda"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        />
                      </div>
                    )}

                    {/* Image Preview if available */}
                    {imageUrl && (
                      <div className="flex items-center gap-4 bg-white p-3 border border-[#E8E5DF]">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover border border-[#E8E5DF]"
                        />
                        <div className="flex-1 text-xs text-[#787672] truncate">
                          <span className="text-[#141414] font-medium block">Foto terpilih:</span>
                          <span className="truncate block font-mono text-[10px]">{imageUrl.slice(0, 70)}...</span>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-xs text-red-600 tracking-wide font-medium">{uploadError}</p>
                    )}

                    {/* Metadata Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          Judul Foto *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Contoh: The Quiet Vow"
                          className="w-full px-3.5 py-2 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          Kategori
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as CategoryId)}
                          className="w-full px-3.5 py-2 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        >
                          {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          Lokasi (Opsional)
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Contoh: Yogyakarta / Bali"
                          className="w-full px-3.5 py-2 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          Tahun
                        </label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2026"
                          className="w-full px-3.5 py-2 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                          Deskripsi Alt (SEO)
                        </label>
                        <input
                          type="text"
                          value={alt}
                          onChange={(e) => setAlt(e.target.value)}
                          placeholder="Deskripsi singkat foto"
                          className="w-full px-3.5 py-2 bg-white border border-[#D1CEC7] text-sm focus:outline-none focus:border-[#141414]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      {editingId && (
                        <button
                          type="button"
                          onClick={handleCancelForm}
                          className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium text-[#787672] hover:text-[#141414] transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-[#141414] text-[#FAF8F5] px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333333] transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        {editingId ? 'Perbarui Foto' : 'Tambahkan ke Galeri'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* List of Existing Works */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[#141414]">
                      Daftar Foto di Galeri ({works.length})
                    </h4>
                    <span className="text-[11px] text-[#787672]">
                      Perubahan tersimpan otomatis di browser ini
                    </span>
                  </div>

                  <div className="space-y-3">
                    {works.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 bg-white border border-[#E8E5DF] hover:border-[#D1CEC7] transition-colors"
                      >
                        <div className="flex items-center space-x-4 min-w-0">
                          <span className="text-xs font-mono text-[#787672] w-6">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover bg-[#E8E5DF]"
                          />
                          <div className="min-w-0">
                            <h5 className="text-sm font-medium text-[#141414] truncate">
                              {item.title}
                            </h5>
                            <p className="text-[11px] text-[#787672] tracking-wider uppercase">
                              {item.categoryLabel} {item.location ? `&bull; ${item.location}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pl-4">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-2 text-[#787672] hover:text-[#141414] hover:bg-[#F4F2ED] transition-colors cursor-pointer"
                            title="Edit foto ini"
                          >
                            <Edit2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(item.id, item.title)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ================= TAB 2: BRANDING (HERO & PROFIL) ================= */}
            {activeTab === 'branding' && (
              <div className="space-y-8">
                {/* Hero Focal Image */}
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                        Foto Utama (Hero Section)
                      </h4>
                      <p className="text-xs text-[#787672]">
                        Foto besar yang pertama kali muncul di bagian paling atas website.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-6 aspect-[16/9] overflow-hidden bg-[#E8E5DF]">
                      <img
                        src={heroUrl}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-6 space-y-3">
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        onChange={handleHeroFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Ganti dari HP / Laptop
                      </button>

                      <div className="pt-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Atau Masukkan URL:
                        </label>
                        <input
                          type="url"
                          value={heroUrl}
                          onChange={(e) => setHeroUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Profile Photo */}
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div>
                    <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                      Foto Profil Fotografer (Section About)
                    </h4>
                    <p className="text-xs text-[#787672]">
                      Potret diri Anda di samping narasi profil. Anda dapat mengganti atau menghapusnya jika ingin fokus sepenuhnya pada karya dan vendor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 aspect-[3/4] max-w-[180px] overflow-hidden bg-[#E8E5DF] border border-[#E8E5DF] relative flex items-center justify-center">
                      {profileImgUrl ? (
                        <img
                          src={profileImgUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-4 text-center text-[#787672]">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span className="text-[10px] uppercase tracking-wider block">Tanpa Foto Profil</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <input
                        type="file"
                        ref={profileFileInputRef}
                        onChange={handleProfileFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => profileFileInputRef.current?.click()}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Ganti Foto Profil
                        </button>

                        {profileImgUrl && (
                          <button
                            type="button"
                            onClick={() => setProfileImgUrl('')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/60 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                            title="Hapus foto profil fotografer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus Foto Profil
                          </button>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Atau Masukkan URL:
                        </label>
                        <input
                          type="url"
                          value={profileImgUrl}
                          onChange={(e) => setProfileImgUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="Kosongkan jika ingin menghapus foto profil"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Identity & Profile */}
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E5DF] pb-3">
                    <User className="w-4 h-4 text-[#141414]" />
                    <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                      Identitas Vendor &amp; Profil
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Nama Vendor / Brand Utama:
                      </label>
                      <input
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                        placeholder="Contoh: kham.photo atau Irkham Studio"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Nama Pribadi Fotografer (Opsional):
                      </label>
                      <input
                        type="text"
                        value={photographerName}
                        onChange={(e) => setPhotographerName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                        placeholder="Contoh: Irkham Fatkhurrozi"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Keahlian / Sub-judul:
                      </label>
                      <input
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                        placeholder="Contoh: PHOTOGRAPHY"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Lokasi Basis &amp; Layanan:
                      </label>
                      <input
                        type="text"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                        placeholder="Contoh: Yogyakarta & Bali, Indonesia — Available Worldwide"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                      Tagline Ringkas:
                    </label>
                    <input
                      type="text"
                      value={taglineText}
                      onChange={(e) => setTaglineText(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                      placeholder="Contoh: Stories, moments, and people — captured honestly."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Kalimat Pembuka About (Headline):
                      </label>
                      <textarea
                        rows={3}
                        value={bioIntroText}
                        onChange={(e) => setBioIntroText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414] leading-relaxed"
                        placeholder="Contoh: Hi, I'm Irkham — capturing honest moments..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Kutipan Filosofi Bio:
                      </label>
                      <textarea
                        rows={3}
                        value={bioQuoteText}
                        onChange={(e) => setBioQuoteText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414] leading-relaxed"
                        placeholder="Contoh: I believe good photographs don't need to be complicated..."
                      />
                    </div>
                  </div>
                </div>

                {/* Approach Philosophy */}
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E5DF] pb-3">
                    <Compass className="w-4 h-4 text-[#141414]" />
                    <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                      Filosofi Pendekatan (Our Approach)
                    </h4>
                  </div>
                  <p className="text-xs text-[#787672]">
                    Teks ini tampil di kolom samping bagian Our Approach pada section About.
                  </p>
                  <div>
                    <textarea
                      rows={3}
                      value={approachText}
                      onChange={(e) => setApproachText(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414] leading-relaxed"
                      placeholder="Tuliskan filosofi kerja visual studio Anda..."
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E8E5DF] pb-3">
                    <Phone className="w-4 h-4 text-[#141414]" />
                    <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                      Informasi Kontak &amp; Booking
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Judul Utama Bagian Kontak:
                      </label>
                      <input
                        type="text"
                        value={contactHeadlineText}
                        onChange={(e) => setContactHeadlineText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                        placeholder="Contoh: Mari abadikan babak perjalanan berharga Anda bersama kami."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                        Deskripsi / Ajakan Konsultasi:
                      </label>
                      <textarea
                        rows={2}
                        value={contactDescText}
                        onChange={(e) => setContactDescText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414] leading-relaxed"
                        placeholder="Contoh: Jadwalkan sesi konsultasi gratis..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Email:
                        </label>
                        <input
                          type="email"
                          value={emailText}
                          onChange={(e) => setEmailText(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="hello@vendor.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Link URL WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={whatsappText}
                          onChange={(e) => setWhatsappText(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="https://wa.me/6285161610146"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Teks Tampilan WhatsApp:
                        </label>
                        <input
                          type="text"
                          value={whatsappDisplayText}
                          onChange={(e) => setWhatsappDisplayText(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="+62 851-6161-0146"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Link URL Instagram:
                        </label>
                        <input
                          type="text"
                          value={instagramText}
                          onChange={(e) => setInstagramText(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="https://instagram.com/kham.photo"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1">
                          Username / Handle Instagram:
                        </label>
                        <input
                          type="text"
                          value={instagramHandleText}
                          onChange={(e) => setInstagramHandleText(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D1CEC7] text-xs focus:outline-none focus:border-[#141414]"
                          placeholder="@kham.photo"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E5DF]">
                  {brandSaved ? (
                    <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" /> Seluruh data Profil, Approach &amp; Kontak berhasil disimpan!
                    </span>
                  ) : (
                    <span className="text-xs text-[#787672]">Klik simpan untuk menerapkan seluruh perubahan ke web utama</span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveBranding}
                    className="inline-flex items-center gap-2 bg-[#141414] text-[#FAF8F5] px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Simpan Semua Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 3: EKSPOR & RESET ================= */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                        Ekspor Data Galeri untuk GitHub / Vercel
                      </h4>
                      <p className="text-xs text-[#787672]">
                        Jika Anda ingin menyimpan data foto ini secara permanen ke file project git (`src/data/portfolio.ts`), salin kode di bawah ini:
                      </p>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 bg-[#141414] text-[#FAF8F5] px-4 py-2 text-xs tracking-wider uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Tersalin!' : 'Salin Kode'}
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={`export const WORKS_DATA: PhotoWork[] = ${JSON.stringify(works, null, 2)};`}
                    rows={10}
                    className="w-full font-mono text-[11px] p-4 bg-[#F4F2ED] border border-[#E8E5DF] text-[#141414] focus:outline-none select-all"
                  />
                </div>

                {/* Reset defaults */}
                <div className="bg-white p-6 border border-[#E8E5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-red-700 uppercase tracking-wider">
                      Reset ke Foto Contoh Awal
                    </h5>
                    <p className="text-xs text-[#787672]">
                      Hapus semua foto kustom yang telah Anda tambahkan dan kembalikan ke foto kurasi awal.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin mereset kembali ke galeri foto awal?')) {
                        onResetDefaults();
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-2 border border-red-300 text-red-700 px-5 py-2.5 text-xs tracking-wider uppercase font-medium hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Galeri
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 4: KEAMANAN PIN ================= */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white p-6 border border-[#E8E5DF] space-y-4">
                  <div>
                    <h4 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414]">
                      Ubah PIN Akses Pemilik
                    </h4>
                    <p className="text-xs text-[#787672] mt-1">
                      PIN ini digunakan untuk memproteksi tombol dan panel kurasi agar pengunjung umum tidak dapat mengubah galeri Anda.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newPinInput.trim().length < 4) {
                        setPinMsg({ type: 'error', text: 'PIN minimal harus 4 digit angka.' });
                        return;
                      }
                      if (newPinInput.trim() !== confirmPinInput.trim()) {
                        setPinMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak cocok.' });
                        return;
                      }
                      onUpdatePin(newPinInput.trim());
                      setPinMsg({ type: 'success', text: 'PIN akses pemilik berhasil diperbarui!' });
                      setNewPinInput('');
                      setConfirmPinInput('');
                    }}
                    className="space-y-4 max-w-md pt-2"
                  >
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                        PIN Baru (4–8 digit angka)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={8}
                        required
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D1CEC7] text-sm tracking-[0.3em] font-mono focus:outline-none focus:border-[#141414]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#787672] mb-1 font-medium">
                        Ulangi PIN Baru
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={8}
                        required
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Ulangi PIN baru"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D1CEC7] text-sm tracking-[0.3em] font-mono focus:outline-none focus:border-[#141414]"
                      />
                    </div>

                    {pinMsg && (
                      <p
                        className={`text-xs font-medium tracking-wide ${
                          pinMsg.type === 'success' ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {pinMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="bg-[#141414] text-[#FAF8F5] px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      Simpan PIN Baru
                    </button>
                  </form>
                </div>

                {/* Lock Panel / Logout button */}
                <div className="bg-[#F4F2ED] p-6 border border-[#E8E5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-[#141414] uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Kunci Akses Pemilik
                    </h5>
                    <p className="text-xs text-[#787672] mt-0.5">
                      Keluar dari mode owner dan kunci kembali website agar tombol editor tertutup bagi pengunjung.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onLock();
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 bg-[#141414] text-[#FAF8F5] px-5 py-2.5 text-xs tracking-wider uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Kunci &amp; Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
