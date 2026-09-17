import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, X, Check, Upload } from 'lucide-react';

interface EditableImageProps {
  url: string;
  alt: string;
  onSaveUrl: (newUrl: string) => void;
  isEditable?: boolean;
  className?: string;
  aspectRatio?: string;
  containerClassName?: string;
  label?: string;
  allowDelete?: boolean;
  onDelete?: () => void;
}

export default function EditableImage({
  url,
  alt,
  onSaveUrl,
  isEditable = false,
  className = '',
  containerClassName = '',
  label = 'Ganti Foto',
  allowDelete = false,
  onDelete,
}: EditableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState(url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftUrl(url);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (draftUrl.trim()) {
      onSaveUrl(draftUrl.trim());
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (1.5MB for Firestore data URL)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimum 2MB untuk kualitas web optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`relative group/image ${containerClassName}`}>
      {url ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={className}
        />
      ) : (
        <div className="w-full h-full min-h-[220px] bg-[#E8E5DF]/40 flex flex-col items-center justify-center text-[#787672] p-6 text-center">
          <Camera className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs uppercase tracking-wider">Belum ada foto</span>
        </div>
      )}

      {/* Admin Hover Overlay Button */}
      {isEditable && (
        <button
          type="button"
          onClick={handleOpen}
          className="absolute top-4 right-4 z-30 inline-flex items-center gap-2 bg-[#141414]/90 hover:bg-[#141414] text-[#FAF8F5] px-3.5 py-2 text-xs tracking-wider uppercase font-medium backdrop-blur-md shadow-lg transition-all transform hover:scale-105 cursor-pointer opacity-90 group-hover/image:opacity-100"
          title={label}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      {/* Quick Image Replacement Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div
            className="bg-[#FAF8F5] border border-[#D1CEC7] shadow-2xl max-w-lg w-full p-6 space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414] flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {label}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#787672] hover:text-[#141414] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Current / Draft */}
            <div className="relative aspect-video max-h-48 overflow-hidden bg-[#E8E5DF]/50 border border-[#D1CEC7]">
              {draftUrl ? (
                <img
                  src={draftUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#787672]">
                  Belum ada preview
                </div>
              )}
            </div>

            {/* Upload from device */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                1. Unggah Langsung Dari Galeri / Laptop
              </label>
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
                className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-[#141414]/50 py-3 text-xs tracking-wider uppercase font-medium hover:bg-[#E8E5DF]/40 transition-colors cursor-pointer bg-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto dari Galeri</span>
              </button>
            </div>

            {/* OR URL Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                2. Atau Tempel Tautan / URL Gambar (Unsplash / Cloud)
              </label>
              <input
                type="url"
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs focus:border-[#141414] focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E5DF]">
              {allowDelete && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                    setIsModalOpen(false);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 tracking-wider uppercase cursor-pointer"
                >
                  Hapus Foto Ini
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D1CEC7] text-xs uppercase tracking-wider hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Terapkan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
