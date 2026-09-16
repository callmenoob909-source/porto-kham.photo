import React, { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Lock,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  LogOut,
  Upload,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Home,
  User,
  Compass,
  Phone,
  MessageCircle,
  Mail,
  Instagram,
  FileText
} from 'lucide-react';
import { PhotoWork, CategoryId, PhotographerProfile } from '../types';
import { CATEGORIES, PROFILE_DATA } from '../data/portfolio';
import { compressImageFile } from '../utils/imageCompressor';

interface AdminPageProps {
  works: PhotoWork[];
  onSaveWorks: (works: PhotoWork[]) => Promise<void> | void;
  heroImage: { url: string; alt: string };
  onSaveHeroImage: (hero: { url: string; alt: string }) => Promise<void> | void;
  profile: PhotographerProfile;
  onSaveProfile: (profile: PhotographerProfile) => Promise<void> | void;
  onResetDefaults: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => Promise<void> | void;
  onBackToHome: () => void;
  syncStatus?: 'synced' | 'saving' | 'error';
}

export default function AdminPage({
  works,
  onSaveWorks,
  heroImage,
  onSaveHeroImage,
  profile,
  onSaveProfile,
  onResetDefaults,
  currentPin,
  onUpdatePin,
  onBackToHome,
  syncStatus = 'synced',
}: AdminPageProps) {
  // Authentication state for /admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kham_admin_session_auth') === 'true';
  });

  // Login PIN form
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Active Tab inside Admin
  const [activeTab, setActiveTab] = useState<'works' | 'branding' | 'security'>('works');

  // Work Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoSourceType, setPhotoSourceType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('WEDDING');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('2026');
  const [alt, setAlt] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Hero & Profile state
  const [heroUrl, setHeroUrl] = useState(heroImage.url);
  const [profileImgUrl, setProfileImgUrl] = useState(profile.portraitImage);
  const [brandSaved, setBrandSaved] = useState(false);

  // Editable Profile, Approach & Contact details
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

  // Keep state synced when profile prop updates
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

  // PIN change state
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => pinInputRef.current?.focus(), 150);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kham_admin_session_auth', 'true');
      setLoginError('');
      setPinInput('');
    } else {
      setLoginError('PIN salah. Akses ditolak.');
      setPinInput('');
      pinInputRef.current?.focus();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kham_admin_session_auth');
    setPinInput('');
  };

  // Upload handler for works
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Mohon pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    try {
      setFormError('');
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      setImageUrl(compressed);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch {
      setFormError('Gagal memproses gambar. Silakan coba file lain.');
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
    setFormError('');

    const formBox = document.getElementById('admin-photo-form');
    if (formBox) {
      formBox.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setImageUrl('');
    setTitle('');
    setLocation('');
    setYear('2026');
    setAlt('');
    setFormError('');
  };

  const handleSavePhotoForm = (e: FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setFormError('Foto belum dipilih atau URL foto masih kosong.');
      return;
    }
    if (!title.trim()) {
      setFormError('Judul foto wajib diisi.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === category);
    const categoryLabel = catObj ? catObj.label.charAt(0) + catObj.label.slice(1).toLowerCase() : category;

    if (editingId) {
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
            alt: alt.trim() || `${title} - Fotografi oleh Irkham`,
          };
        }
        return w;
      });
      onSaveWorks(updated);
      setSuccessMsg(`Foto "${title}" berhasil diperbarui.`);
    } else {
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
        alt: alt.trim() || `${title} - Fotografi oleh Irkham`,
      };
      onSaveWorks([newPhoto, ...works]);
      setSuccessMsg(`Foto "${title}" berhasil ditambahkan ke portofolio.`);
    }

    handleCancelForm();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeletePhoto = (id: string, photoTitle: string) => {
    if (window.confirm(`Hapus foto "${photoTitle}" dari portofolio?`)) {
      const updated = works.filter((w) => w.id !== id);
      onSaveWorks(updated);
      if (editingId === id) {
        handleCancelForm();
      }
      setSuccessMsg(`Foto "${photoTitle}" telah dihapus.`);
      setTimeout(() => setSuccessMsg(''), 3000);
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
      role: roleTitle.trim(),
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
    setTimeout(() => setBrandSaved(false), 3000);
  };

  const handleChangePin = (e: FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    if (newPinInput.length < 4) {
      setPinChangeMsg({ type: 'error', text: 'PIN minimal harus 4 digit.' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak sesuai.' });
      return;
    }

    onUpdatePin(newPinInput);
    setPinChangeMsg({ type: 'success', text: 'PIN berhasil diubah. Simpan PIN baru Anda baik-baik.' });
    setNewPinInput('');
    setConfirmPinInput('');
  };

  // 1. UN-AUTHENTICATED VIEW: Clean, Minimalist Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col justify-between p-6 sm:p-12">
        <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#787672] hover:text-[#141414] transition-colors cursor-pointer py-2"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            <span>Kembali ke Website</span>
          </button>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672]">
            KHAM.PHOTO / ADMIN
          </span>
        </header>

        <main className="max-w-md w-full mx-auto my-12">
          <div className="bg-[#FAF8F5] border border-[#E8E5DF] p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#141414] text-[#FAF8F5] flex items-center justify-center">
                <Lock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672] font-medium block">
                  ADMINISTRATOR
                </span>
                <h1 className="text-2xl font-serif italic text-[#141414] mt-1">
                  Masuk Panel Admin
                </h1>
              </div>
              <p className="text-xs text-[#787672] leading-relaxed max-w-xs">
                Halaman ini khusus pemilik website untuk mengedit, menambah, dan menghapus foto portofolio.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block font-medium">
                  PIN Keamanan
                </label>
                <div className="relative">
                  <input
                    ref={pinInputRef}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pinInput}
                    onChange={(e) => {
                      setLoginError('');
                      setPinInput(e.target.value);
                    }}
                    placeholder="Masukkan PIN"
                    className="w-full text-center tracking-[0.35em] font-mono text-xl py-3 px-10 bg-white border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787672] hover:text-[#141414] p-1 cursor-pointer"
                    aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center justify-center space-x-1.5 text-xs text-red-600 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#141414] text-[#FAF8F5] py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Masuk ke Panel Admin</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#E8E5DF] text-center">
              <p className="text-[11px] text-[#A8A59F]">
                Halaman ini hanya dapat diakses melalui URL rahasia <code className="text-[#141414] bg-[#F0EDE8] px-1 py-0.5 rounded">/admin</code>
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center text-[10px] tracking-[0.2em] uppercase text-[#A8A59F]">
          &copy; 2026 {PROFILE_DATA.vendorName} &bull; Admin Console
        </footer>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-[#E8E5DF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-[#787672] hover:text-[#141414] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Lihat Web</span>
            </button>
            <span className="text-[#D1CEC7]">/</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-serif italic text-[#141414] hidden sm:inline">
                khamphoto.eu.cc/admin
              </span>
              <span className="px-2 py-0.5 bg-[#141414] text-[#FAF8F5] text-[9px] tracking-[0.2em] uppercase font-semibold">
                OWNER MODE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] tracking-[0.15em] uppercase font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {syncStatus === 'saving' ? 'Menyimpan ke Cloud...' : 'Cloud Firestore Aktif'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-red-600 hover:text-red-700 transition-colors cursor-pointer px-3 py-1.5 border border-red-200 hover:border-red-400 bg-red-50/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar (Lock)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-12 w-full flex-1">
        {/* Banner / Flash message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-[#141414] text-[#FAF8F5] text-xs tracking-[0.1em] flex items-center justify-between transition-all">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-[#A8A59F] hover:text-white text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Dashboard Title & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E5DF] pb-6 mb-8 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672] block mb-1">
              PANEL KELOLA PORTOFOLIO
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#141414]">
              Manajemen Karya & Galeri
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 border border-[#E8E5DF] p-1 bg-white">
            <button
              onClick={() => setActiveTab('works')}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                activeTab === 'works'
                  ? 'bg-[#141414] text-[#FAF8F5] font-medium'
                  : 'text-[#787672] hover:text-[#141414]'
              }`}
            >
              Karya Foto ({works.length})
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                activeTab === 'branding'
                  ? 'bg-[#141414] text-[#FAF8F5] font-medium'
                  : 'text-[#787672] hover:text-[#141414]'
              }`}
            >
              Profil, About & Kontak
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#141414] text-[#FAF8F5] font-medium'
                  : 'text-[#787672] hover:text-[#141414]'
              }`}
            >
              Ganti PIN
            </button>
          </div>
        </div>

        {/* TAB 1: KELOLA KARYA (ADD / EDIT / DELETE) */}
        {activeTab === 'works' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Box (Left/Top) */}
            <div
              id="admin-photo-form"
              className="lg:col-span-5 bg-white border border-[#E8E5DF] p-6 sm:p-8 self-start sticky lg:top-24 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#141414]" />
                  <h2 className="text-sm tracking-[0.2em] uppercase font-semibold text-[#141414]">
                    {editingId ? 'Edit Karya Foto' : 'Tambah Foto Baru'}
                  </h2>
                </div>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="text-xs text-[#787672] hover:text-[#141414] underline cursor-pointer"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePhotoForm} className="space-y-5">
                {/* Method selector: Upload file or URL */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-2 font-medium">
                    Sumber Gambar Foto
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('upload')}
                      className={`py-2 text-xs tracking-[0.1em] uppercase border cursor-pointer transition-colors ${
                        photoSourceType === 'upload'
                          ? 'border-[#141414] bg-[#141414] text-[#FAF8F5]'
                          : 'border-[#E8E5DF] text-[#787672] hover:border-[#141414]'
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSourceType('url')}
                      className={`py-2 text-xs tracking-[0.1em] uppercase border cursor-pointer transition-colors ${
                        photoSourceType === 'url'
                          ? 'border-[#141414] bg-[#141414] text-[#FAF8F5]'
                          : 'border-[#E8E5DF] text-[#787672] hover:border-[#141414]'
                      }`}
                    >
                      URL Gambar
                    </button>
                  </div>

                  {photoSourceType === 'upload' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#D1CEC7] hover:border-[#141414] transition-colors p-6 text-center cursor-pointer bg-[#FAF8F5] flex flex-col items-center justify-center space-y-2"
                      >
                        <Upload className="w-6 h-6 text-[#787672]" />
                        <span className="text-xs tracking-[0.1em] uppercase font-medium text-[#141414]">
                          Pilih Foto dari Perangkat
                        </span>
                        <span className="text-[10px] text-[#A8A59F]">
                          JPG, PNG, WEBP (Otomatis dikompresi agar loading cepat)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau URL foto"
                        className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {/* Preview of Image */}
                  {imageUrl && (
                    <div className="mt-3 relative border border-[#E8E5DF] bg-[#FAF8F5] p-2 flex items-center space-x-3">
                      <img
                        src={imageUrl}
                        alt="Pratinjau Foto"
                        className="w-16 h-16 object-cover border border-[#E8E5DF]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] tracking-[0.15em] uppercase text-emerald-700 font-semibold block">
                          Foto Terpilih
                        </span>
                        <span className="text-xs text-[#787672] truncate block">
                          {title || 'Siap disimpan ke galeri'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-xs text-red-600 hover:text-red-700 p-1 cursor-pointer"
                        title="Hapus foto ini"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1.5 font-medium">
                    Judul Foto / Seri Karya *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: The Sacred Vow, Golden Reverie..."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                  />
                </div>

                {/* Category, Location & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1.5 font-medium">
                      Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors uppercase cursor-pointer"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'ALL').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1.5 font-medium">
                      Lokasi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Yogyakarta, Bali, dsb."
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1.5 font-medium">
                      Tahun
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2026"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center space-x-1.5 text-xs text-red-600 bg-red-50 p-2.5 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#141414] text-[#FAF8F5] py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {editingId ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Tambahkan ke Galeri</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Works List / Table (Right) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#141414]">
                  Daftar Foto di Galeri ({works.length})
                </span>
                <span className="text-[11px] text-[#787672]">
                  Urutan: Atas = Tampil paling awal di web
                </span>
              </div>

              <div className="space-y-3">
                {works.map((work, index) => (
                  <div
                    key={work.id}
                    className={`bg-white border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      editingId === work.id ? 'border-[#141414] ring-1 ring-[#141414]' : 'border-[#E8E5DF] hover:border-[#D1CEC7]'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className="text-xs font-mono text-[#A8A59F] w-6 flex-shrink-0 text-center">
                        #{index + 1}
                      </span>
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-[#E8E5DF] flex-shrink-0 bg-[#F0EDE8]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E8E5DF] text-[#141414] font-medium">
                            {work.category}
                          </span>
                          <span className="text-[10px] text-[#787672] uppercase font-mono">
                            {work.year || '2026'}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-[#141414] truncate">
                          {work.title}
                        </h3>
                        {work.location && (
                          <p className="text-xs text-[#787672] truncate mt-0.5">
                            {work.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:self-center justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0EDE8]">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(work)}
                        className="inline-flex items-center gap-1 text-xs tracking-[0.1em] uppercase px-3 py-1.5 border border-[#D1CEC7] hover:border-[#141414] text-[#141414] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(work.id, work.title)}
                        className="inline-flex items-center gap-1 text-xs tracking-[0.1em] uppercase px-3 py-1.5 border border-red-200 hover:border-red-400 text-red-600 transition-colors cursor-pointer bg-red-50/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {works.length === 0 && (
                  <div className="bg-white border border-[#E8E5DF] p-12 text-center text-[#787672]">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#D1CEC7]" />
                    <p className="text-sm">Belum ada foto dalam galeri.</p>
                    <p className="text-xs mt-1">Gunakan formulir di sebelah kiri untuk menambahkan karya.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO, PROFIL, ABOUT & KONTAK */}
        {activeTab === 'branding' && (
          <div className="max-w-4xl bg-white border border-[#E8E5DF] p-6 sm:p-10 space-y-10">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672] block mb-1">
                KONTROL KONTEN UTAMA
              </span>
              <h2 className="text-xl font-serif text-[#141414] mb-1">
                Profil, About, Pendekatan (Approach) &amp; Kontak
              </h2>
              <p className="text-xs text-[#787672]">
                Sesuaikan teks, filosofi pendekatan karya, narasi vendor, hingga informasi kontak langsung dari panel ini.
              </p>
            </div>

            {/* SEKSI 1: FOTO HERO & PROFIL */}
            <div className="space-y-6 pt-4 border-t border-[#E8E5DF]">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-[#141414] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                1. Gambar Sampul Hero &amp; Foto Profil
              </h3>

              {/* Hero Image */}
              <div className="space-y-3 bg-[#FAF8F5] p-4 sm:p-5 border border-[#E8E5DF]">
                <label className="text-xs font-medium text-[#141414] block">
                  Foto Sampul Hero (Tampilan Beranda Paling Atas)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={heroUrl}
                    alt="Hero Preview"
                    className="w-full sm:w-48 h-32 object-cover border border-[#E8E5DF] bg-white"
                  />
                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="url"
                      value={heroUrl}
                      onChange={(e) => setHeroUrl(e.target.value)}
                      placeholder="URL gambar hero..."
                      className="w-full text-xs p-3 bg-white border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const dataUrl = await compressImageFile(f, 2000, 2000, 0.88);
                          setHeroUrl(dataUrl);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="text-xs tracking-[0.1em] uppercase px-4 py-2 border border-[#D1CEC7] hover:border-[#141414] transition-colors cursor-pointer inline-flex items-center gap-2 bg-white"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Komputer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-3 bg-[#FAF8F5] p-4 sm:p-5 border border-[#E8E5DF]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-[#141414] block">
                      Foto Potret Diri / Tim (About Section)
                    </label>
                    <span className="text-[11px] text-[#787672]">
                      Opsional: Hapus foto jika Anda hanya ingin menonjolkan nama vendor dan karya foto saja.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-32 h-40 border border-[#E8E5DF] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profileImgUrl ? (
                      <img
                        src={profileImgUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-[#A8A59F]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[9px] uppercase tracking-wider block">Tanpa Foto</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="url"
                      value={profileImgUrl}
                      onChange={(e) => setProfileImgUrl(e.target.value)}
                      placeholder="URL gambar potret profil (atau kosongkan untuk menghapus)..."
                      className="w-full text-xs p-3 bg-white border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const dataUrl = await compressImageFile(f, 1200, 1200, 0.85);
                          setProfileImgUrl(dataUrl);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => profileFileInputRef.current?.click()}
                        className="text-xs tracking-[0.1em] uppercase px-4 py-2 border border-[#D1CEC7] hover:border-[#141414] transition-colors cursor-pointer inline-flex items-center gap-2 bg-white"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto dari Komputer</span>
                      </button>

                      {profileImgUrl && (
                        <button
                          type="button"
                          onClick={() => setProfileImgUrl('')}
                          className="text-xs tracking-[0.1em] uppercase px-4 py-2 border border-red-200 hover:border-red-400 text-red-600 bg-red-50/50 hover:bg-red-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          title="Hapus foto profil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Foto Profil</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKSI 2: IDENTITAS VENDOR & PROFIL FOTOGRAFER */}
            <div className="space-y-4 pt-6 border-t border-[#E8E5DF]">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-[#141414] flex items-center gap-2">
                <User className="w-4 h-4" />
                2. Identitas Vendor &amp; Profil Utama
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Nama Vendor / Brand Utama
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Contoh: kham.photo atau Irkham Studio"
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#787672] mt-0.5 block">
                    Nama brand yang disorot utama di logo navbar, hero, dan footer.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Nama Pribadi Fotografer (Opsional)
                  </label>
                  <input
                    type="text"
                    value={photographerName}
                    onChange={(e) => setPhotographerName(e.target.value)}
                    placeholder="Contoh: Irkham Fatkhurrozi"
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#787672] mt-0.5 block">
                    Tampil halus sebagai byline ("BY [NAMA]" atau bisa dikosongkan).
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Sub-judul / Keahlian (Opsional)
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin menampilkan sub-judul"
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#787672] mt-0.5 block">
                    Bisa dikosongkan agar tampilan murni hanya nama vendor saja.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Lokasi Basis Studio &amp; Layanan
                  </label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="Contoh: Yogyakarta & Bali, Indonesia — Available Worldwide"
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#141414] block mb-1">
                  Tagline Ringkas (Hero &amp; Metadata)
                </label>
                <input
                  type="text"
                  value={taglineText}
                  onChange={(e) => setTaglineText(e.target.value)}
                  placeholder="Contoh: Stories, moments, and people — captured honestly."
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Kalimat Pembuka About (Headline Quote)
                  </label>
                  <textarea
                    rows={3}
                    value={bioIntroText}
                    onChange={(e) => setBioIntroText(e.target.value)}
                    placeholder="Contoh: Hi, I'm Irkham — capturing honest moments, quiet details, and real stories."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Kutipan Filosofi Bio (Body Quote)
                  </label>
                  <textarea
                    rows={3}
                    value={bioQuoteText}
                    onChange={(e) => setBioQuoteText(e.target.value)}
                    placeholder="Contoh: I believe good photographs don't need to be complicated. They simply need to make you feel something."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SEKSI 3: ABOUT APPROACH PHILOSOPHY */}
            <div className="space-y-4 pt-6 border-t border-[#E8E5DF]">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-[#141414] flex items-center gap-2">
                <Compass className="w-4 h-4" />
                3. Filosofi Pendekatan (Our Approach)
              </h3>
              <p className="text-xs text-[#787672]">
                Paragraf ini muncul pada kolom samping bagian <strong>Our Approach</strong> di halaman About untuk menjelaskan metode kerja Anda.
              </p>

              <div>
                <label className="text-xs font-medium text-[#141414] block mb-1">
                  Teks Pendekatan Filosofis
                </label>
                <textarea
                  rows={4}
                  value={approachText}
                  onChange={(e) => setApproachText(e.target.value)}
                  placeholder="Contoh: Kami percaya bahwa dokumentasi terbaik lahir dari interaksi yang tidak dipaksakan. Kami hadir sebagai pengamat yang cermat..."
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* SEKSI 4: INFORMASI KONTAK & BOOKING */}
            <div className="space-y-4 pt-6 border-t border-[#E8E5DF]">
              <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-[#141414] flex items-center gap-2">
                <Phone className="w-4 h-4" />
                4. Bagian Kontak &amp; Media Sosial
              </h3>
              <p className="text-xs text-[#787672]">
                Atur headline kontak, teks pembuka, alamat email, WhatsApp, serta akun Instagram portofolio.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Judul Utama / Headline Bagian Kontak
                  </label>
                  <input
                    type="text"
                    value={contactHeadlineText}
                    onChange={(e) => setContactHeadlineText(e.target.value)}
                    placeholder="Contoh: Mari abadikan babak perjalanan berharga Anda bersama kami."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#141414] block mb-1">
                    Deskripsi / Ajakan Konsultasi
                  </label>
                  <textarea
                    rows={2}
                    value={contactDescText}
                    onChange={(e) => setContactDescText(e.target.value)}
                    placeholder="Contoh: Jadwalkan sesi konsultasi gratis untuk mendiskusikan konsep visual dan tanggal istimewa Anda."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-medium text-[#141414] flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-[#787672]" />
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      placeholder="hello@vendor.com"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141414] flex items-center gap-1.5 mb-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#787672]" />
                      Link / URL WhatsApp
                    </label>
                    <input
                      type="text"
                      value={whatsappText}
                      onChange={(e) => setWhatsappText(e.target.value)}
                      placeholder="https://wa.me/6285161610146"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141414] flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-[#787672]" />
                      Teks Tampilan WhatsApp
                    </label>
                    <input
                      type="text"
                      value={whatsappDisplayText}
                      onChange={(e) => setWhatsappDisplayText(e.target.value)}
                      placeholder="+62 851-6161-0146"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141414] flex items-center gap-1.5 mb-1">
                      <Instagram className="w-3.5 h-3.5 text-[#787672]" />
                      Link URL Instagram
                    </label>
                    <input
                      type="text"
                      value={instagramText}
                      onChange={(e) => setInstagramText(e.target.value)}
                      placeholder="https://instagram.com/kham.photo"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141414] flex items-center gap-1.5 mb-1">
                      <Instagram className="w-3.5 h-3.5 text-[#787672]" />
                      Username / Handle Instagram
                    </label>
                    <input
                      type="text"
                      value={instagramHandleText}
                      onChange={(e) => setInstagramHandleText(e.target.value)}
                      placeholder="@kham.photo"
                      className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {brandSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Seluruh data Hero, Profil, Approach &amp; Kontak berhasil disimpan ke web utama!</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#E8E5DF] flex items-center justify-between">
              <span className="text-xs text-[#787672]">
                Perubahan langsung diterapkan ke tampilan web pengunjung.
              </span>
              <button
                type="button"
                onClick={handleSaveBranding}
                className="bg-[#141414] text-[#FAF8F5] px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Simpan Semua Perubahan
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: GANTI PIN KEAMANAN */}
        {activeTab === 'security' && (
          <div className="max-w-md bg-white border border-[#E8E5DF] p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E8E5DF]">
              <div className="w-10 h-10 rounded-full bg-[#141414] text-[#FAF8F5] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#141414]">
                  Ganti PIN Admin
                </h2>
                <p className="text-xs text-[#787672]">
                  PIN saat ini aktif: <span className="font-mono font-bold text-[#141414]">******</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1 font-medium">
                  PIN Baru (Minimal 4 Angka)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="text-[11px] tracking-[0.15em] uppercase text-[#787672] block mb-1 font-medium">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Ketik ulang PIN baru"
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none font-mono tracking-widest"
                />
              </div>

              {pinChangeMsg && (
                <div
                  className={`p-3 text-xs flex items-center space-x-2 border ${
                    pinChangeMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  {pinChangeMsg.type === 'success' ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#141414] text-[#FAF8F5] py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer mt-2"
              >
                Perbarui PIN Keamanan
              </button>
            </form>

            <div className="pt-4 border-t border-[#E8E5DF] text-[11px] text-[#787672] space-y-2">
              <p>
                PIN ini akan digunakan setiap kali Anda login ke halaman <code className="text-[#141414] bg-[#F0EDE8] px-1 py-0.5 rounded">/admin</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8E5DF] py-6 px-6 sm:px-10 bg-white text-center text-xs text-[#787672] tracking-[0.15em] uppercase">
        {PROFILE_DATA.vendorName} &bull; Admin Console &bull; <button onClick={onBackToHome} className="text-[#141414] hover:underline cursor-pointer">Kembali ke Beranda</button>
      </footer>
    </div>
  );
}
