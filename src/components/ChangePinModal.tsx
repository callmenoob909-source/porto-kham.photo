import React, { useState } from 'react';
import { KeyRound, X, Check, Eye, EyeOff } from 'lucide-react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => Promise<void> | void;
}

export default function ChangePinModal({
  isOpen,
  onClose,
  currentPin,
  onUpdatePin,
}: ChangePinModalProps) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (oldPin !== currentPin) {
      setErrorMsg('PIN lama tidak sesuai!');
      return;
    }

    if (newPin.length < 4) {
      setErrorMsg('PIN baru minimal 4 digit angka!');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok!');
      return;
    }

    await onUpdatePin(newPin);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] border border-[#D1CEC7] shadow-2xl max-w-sm w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
          <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-[#141414] flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Ganti PIN Pemilik
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#787672] hover:text-[#141414] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>PIN berhasil diperbarui!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                PIN Saat Ini
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="Masukkan PIN lama"
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs tracking-widest font-mono focus:border-[#141414] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                PIN Baru
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Minimal 4 digit"
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs tracking-widest font-mono focus:border-[#141414] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#787672] mb-1 font-mono">
                Konfirmasi PIN Baru
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Ulangi PIN baru"
                className="w-full bg-white border border-[#D1CEC7] p-2.5 text-xs tracking-widest font-mono focus:border-[#141414] focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#787672]">
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="inline-flex items-center gap-1 hover:text-[#141414] cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Sembunyikan' : 'Perlihatkan angka'}</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-200">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E5DF]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#D1CEC7] text-xs uppercase tracking-wider hover:bg-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#141414] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium hover:bg-[#333] transition-colors cursor-pointer"
              >
                Simpan PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
