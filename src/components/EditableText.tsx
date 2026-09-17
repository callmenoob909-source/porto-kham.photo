import React, { useState } from 'react';
import { Check, X, Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  isEditable?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  label?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export default function EditableText({
  value,
  onSave,
  isEditable = false,
  multiline = false,
  rows = 3,
  placeholder = 'Klik untuk mengetik...',
  className = '',
  inputClassName = '',
  label,
  tag = 'span',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const Tag = tag as React.ElementType;

  if (!isEditable) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(value);
    setIsEditing(true);
  };

  const handleSave = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDraft(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div
        className="relative inline-flex flex-col bg-white border border-[#141414] p-3 shadow-xl z-30 min-w-[240px] max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {label && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#787672] mb-1.5 block">
            Edit: {label}
          </span>
        )}
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={rows}
            autoFocus
            className={`w-full p-2 text-sm bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none text-[#141414] ${inputClassName}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`w-full p-2 text-sm bg-[#FAF8F5] border border-[#D1CEC7] focus:border-[#141414] focus:outline-none text-[#141414] ${inputClassName}`}
            placeholder={placeholder}
          />
        )}

        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#E8E5DF]">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 bg-[#141414] text-[#FAF8F5] px-3 py-1 text-xs tracking-wider uppercase font-medium hover:bg-[#333] transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 bg-white text-[#787672] border border-[#D1CEC7] px-3 py-1 text-xs tracking-wider uppercase font-medium hover:text-[#141414] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Batal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      className="group/editable relative inline-block cursor-pointer"
      onClick={handleStartEdit}
      title="Klik untuk langsung mengedit teks"
    >
      <Tag className={`${className} transition-opacity`}>
        {value || <span className="italic opacity-60 text-sm font-sans">{placeholder}</span>}
      </Tag>
      <span className="inline-flex items-center justify-center ml-1.5 opacity-0 group-hover/editable:opacity-100 transition-opacity p-0.5 rounded bg-[#141414] text-[#FAF8F5] align-middle shadow-sm">
        <Pencil className="w-2.5 h-2.5" />
      </span>
      <span className="absolute -inset-1 border border-dashed border-[#141414]/30 pointer-events-none rounded opacity-0 group-hover/editable:opacity-100 transition-opacity" />
    </span>
  );
}
