import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Check } from 'lucide-react';
import { CategoryId, PhotoWork } from '../types';
import { CATEGORIES } from '../data/portfolio';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWork: (work: PhotoWork) => void;
  defaultCategory?: CategoryId;
}

export default function AddPhotoModal({
  isOpen,
  onClose,
  onAddWork,
  defaultCategory = 'ALL',
}: AddPhotoModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>(
    defaultCategory === 'ALL' ? 'WEDDING' : defaultCategory
  );
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 2MB untuk ketahanan cloud.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('Silakan pilih atau masukkan URL foto terlebih dahulu.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === category);
    const newWork: PhotoWork = {
      id: `photo-${Date.now()}`,
      title: title.trim() || 'Untitled Series',
      category: category === 'ALL' ? 'WEDDING' : category,
      categoryLabel: catObj && catObj.id !== 'ALL' ? catObj.label : 'Editorial',
      image: imageUrl.trim(),
      alt: title.trim() || 'Photography Artwork',
      location: location.trim(),
      year: year.trim(),
    };

    onAddWork(newWork);
    setTitle('');
    setLocation('');
    setImageUrl('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] border border-[#D1CEC7] shadow-2xl max-w-lg w-full p-6 space-y-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
          <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Foto Ke Portofolio
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#787672] hover:text-[#141414] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Photo Preview & Upload */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
              Visual Foto
            </label>
            <div className="relative aspect-video max-h-48 overflow-hidden bg-[#E8E5DF]/50 border border-[#D1CEC7] mb-2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#787672]">
                  Pilih file foto atau tempel URL
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-[#141414]/50 py-2 text-xs tracking-wider uppercase font-medium hover:bg-white transition-colors cursor-pointer bg-white"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Foto</span>
                </button>
              </div>

              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Atau tempel URL..."
                  className="w-full bg-white border border-[#D1CEC7] p-2 text-xs focus:border-[#141414] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
              Judul Foto / Seri
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: The Sacred Vow — Bali"
              className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs focus:border-[#141414] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs focus:border-[#141414] focus:outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                Tahun
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs focus:border-[#141414] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
              Lokasi Pengambilan (Opsional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Ubud, Bali atau Yogyakarta"
              className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs focus:border-[#141414] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E5DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D1CEC7] text-xs uppercase tracking-wider hover:bg-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan &amp; Tampilkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
