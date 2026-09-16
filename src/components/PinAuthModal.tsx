import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
}

export default function PinAuthModal({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
}: PinAuthModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.trim() === currentPin.trim()) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('PIN salah. Silakan coba lagi.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="pin-auth-modal"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FAF8F5] text-[#141414] w-full max-w-sm rounded-none border border-[#E8E5DF] shadow-2xl p-6 sm:p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-[#787672] hover:text-[#141414] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#141414] text-[#FAF8F5] flex items-center justify-center">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#787672] font-semibold block">
                KHAM.PHOTO &bull; OWNER ACCESS
              </span>
              <h3 className="text-lg font-serif italic text-[#141414] mt-0.5">
                Verifikasi Pemilik Website
              </h3>
            </div>
            <p className="text-xs text-[#787672] leading-relaxed">
              Masukkan PIN keamanan Anda untuk membuka hak akses mengedit dan menambah foto.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setError('');
                  setPin(e.target.value);
                }}
                placeholder="Masukkan PIN"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-10 bg-white border border-[#D1CEC7] focus:border-[#141414] focus:outline-none transition-colors"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787672] hover:text-[#141414] cursor-pointer p-1"
                aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center justify-center space-x-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#141414] text-[#FAF8F5] py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Buka Kunci Editor</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
