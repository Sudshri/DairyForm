import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Drag-and-drop image uploader.
 *
 * Props:
 *   value       [{ url, file?, id? }]   current images
 *   onChange    (files: File[]) => void  called on new selections
 *   onRemove    (index) => void
 *   onSetPrimary(index) => void
 *   maxFiles    number (default 5)
 *   accept      string (default 'image/*')
 *   uploading   boolean
 *   progress    number 0–100
 */
export default function ImageUpload({
  value        = [],
  onChange,
  onRemove,
  onSetPrimary,
  maxFiles     = 5,
  accept       = 'image/jpeg,image/png,image/webp',
  uploading    = false,
  progress     = 0,
  label        = 'Product Images',
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const processFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > 5 * 1024 * 1024) return false; // 5MB max
      return true;
    });
    const remaining = maxFiles - value.length;
    onChange?.(valid.slice(0, remaining));
  }, [value.length, maxFiles, onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleInputChange = (e) => processFiles(e.target.files);

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-slate-700">{label}</p>}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer',
            'transition-all duration-200',
            dragging
              ? 'border-blue-400 bg-blue-50 scale-[1.01]'
              : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={handleInputChange}
          />

          {uploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full border-3 border-blue-400 border-t-transparent animate-spin mx-auto" />
              <div className="w-48 mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500">Uploading… {progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Upload size={22} className="text-blue-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Drop images here or <span className="text-blue-500">browse</span>
              </p>
              <p className="text-xs text-slate-400">
                JPG, PNG, WebP · Max 5 MB · Up to {maxFiles} images
              </p>
            </>
          )}
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <AnimatePresence>
            {value.map((img, idx) => (
              <motion.div
                key={img.url ?? idx}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <img
                  src={img.url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-slate-200"
                />

                {/* Primary badge */}
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-blue-500 text-white text-2xs
                                   px-1.5 py-0.5 rounded-lg font-semibold">
                    Main
                  </span>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0
                                group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {idx !== 0 && onSetPrimary && (
                    <button
                      onClick={() => onSetPrimary(idx)}
                      className="w-7 h-7 rounded-lg bg-yellow-400 text-white flex items-center justify-center"
                      title="Set as primary"
                    >
                      <Star size={12} />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(idx)}
                      className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Add more placeholder */}
            {value.length < maxFiles && value.length > 0 && (
              <motion.button
                layout
                onClick={() => inputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-slate-200 rounded-xl
                           flex flex-col items-center justify-center gap-1
                           hover:border-blue-300 hover:bg-blue-50 transition-all text-slate-400"
              >
                <ImageIcon size={18} />
                <span className="text-2xs">Add</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
