"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, X, Eye, Download, RotateCcw, Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface VisualizeRoomProps {
  designItem?: {
    id: number;
    title: string;
    category: string;
    image: string;
  };
  onClose: () => void;
  onUseLook?: (designItem: { id: number; title: string; category: string; restyledUrl: string }) => void;
}

const STYLE_PROMPTS: Record<string, string> = {
  'Botanical': 'Botanical wallpaper with tropical monstera leaves, emerald and sage tones, natural light, luxury interior photography',
  'Fluted Louver': 'Acoustic fluted walnut slats, vertical wood panels, warm natural lighting, premium modern interior',
  'Neo-Classical': 'Neo-classical moulding panels, ornamental plasterwork, gold accents, concealed LED cove lighting, opulent interior',
  'Temple Pichwai': 'Traditional Pichwai art wall mural, lotus pond motif, hand-painted details, rich terracotta and gold tones',
  'Smart Blinds': 'Motorized smart blinds, automated window treatments, clean minimalist interior, tech-forward luxury home',
};

export default function VisualizeRoom({ designItem, onClose, onUseLook }: VisualizeRoomProps) {
  const [stage, setStage] = useState<'upload' | 'processing' | 'result'>('upload');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const sliderRef = useCallback((el: HTMLDivElement | null) => {
    if (el) (window as { __visualizeSliderEl?: HTMLDivElement }).__visualizeSliderEl = el;
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be under 4MB');
      return;
    }
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const startRestyle = async () => {
    if (!originalFile) return;

    setStage('processing');
    setError(null);

    try {
      const base64 = await fileToBase64(originalFile);
      const prompt = designItem
        ? STYLE_PROMPTS[designItem.category] || 'Luxury interior design makeover, premium materials, professional photography'
        : 'Luxury interior design makeover, premium materials, professional photography';

      const response = await fetch('/api/ai/restyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, prompt, strength: 0.6 }),
      });

      if (!response.ok) throw new Error('Failed to start restyle');
      const { jobId: newJobId } = await response.json();
      startPolling(newJobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start restyle');
      setStage('upload');
    }
  };

  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/ai/restyle/${id}`);
        if (!response.ok) return;
        const result = await response.json();
        
        if (result.status === 'done') {
          clearInterval(interval!);
          setResultUrl(result.resultUrl || null);
          setStage('result');
        } else if (result.status === 'failed') {
          clearInterval(interval!);
          setError(result.error || 'Restyle failed');
          setStage('upload');
        }
      } catch {
        // Ignore polling errors, keep trying
      }
    }, 3000);
    
    setPollingInterval(interval);
  };

  const reset = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setStage('upload');
    setOriginalFile(null);
    setOriginalPreview(null);
    setResultUrl(null);
    setError(null);
    setSliderPosition(50);
  };

  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (originalPreview) URL.revokeObjectURL(originalPreview);
    };
  }, [pollingInterval, originalPreview]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  if (stage === 'upload') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C130B]/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1C130B]/10">
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1C130B]">
              {designItem ? `Visualize: ${designItem.title}` : 'Visualize Your Room'}
            </h2>
            <button onClick={onClose} className="text-[#1C130B]/50 hover:text-[#1C130B] p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Upload Zone */}
          <div className="p-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed ${
                originalFile
                  ? 'border-[#C5A880] bg-[#FAF8F5]'
                  : 'border-[#1C130B]/20 hover:border-[#C5A880]/50 hover:bg-[#C5A880]/5'
              } transition-all p-8 text-center`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {originalPreview ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={originalPreview}
                    alt="Uploaded room photo"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1C130B]/80 text-[#FAF8F5] flex items-center justify-center hover:bg-[#1C130B]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-[#1C130B]/40 mb-4" />
                  <p className="font-['Plus_Jakarta_Sans'] text-[#1C130B] text-lg font-medium mb-2">
                    Upload a photo of your room
                  </p>
                  <p className="text-[#1C130B]/50 text-sm mb-6">
                    Drag & drop or click to select • JPG/PNG • Max 4MB
                  </p>
                  {designItem && (
                    <p className="text-[#8A5836] text-sm font-medium">
                      Suggested style: <span className="text-[#1C130B]">{designItem.category}</span>
                    </p>
                  )}
                </>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={startRestyle}
                disabled={!originalFile}
                className="flex-1 bg-[#1C130B] hover:bg-[#1C130B]/90 text-[#FAF8F5] py-3 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {designItem ? 'Visualize This Look' : 'Generate Visualization'}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-2xl font-medium text-[#1C130B]/60 hover:text-[#1C130B] hover:bg-[#1C130B]/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (stage === 'processing') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C130B]/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Loader2 className="w-24 h-24 text-[#C5A880] animate-spin" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-2 border-[#C5A880]/30 rounded-full"
            />
          </div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#1C130B] mb-2">
            Generating your visualization...
          </h3>
          <p className="text-[#1C130B]/60 text-sm mb-6">
            This usually takes 15&ndash;30 seconds. We&apos;re applying the {designItem?.category || 'selected'} style to your room.
          </p>
          <div className="w-48 mx-auto h-2 bg-[#1C130B]/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 20, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-[#C5A880] to-[#8A5836] rounded-full"
            />
          </div>
          <button
            onClick={reset}
            className="mt-6 text-[#1C130B]/50 hover:text-[#1C130B] font-medium text-sm"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // Result stage - Before/After slider
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C130B]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[85vh] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1C130B]/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#15803D]" />
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1C130B]">
                {designItem ? designItem.title : 'Your Visualization'}
              </h2>
              <p className="text-[#1C130B]/50 text-xs">{designItem?.category} style applied</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resultUrl && window.open(resultUrl, '_blank')}
              className="p-2 rounded-xl bg-[#1C130B]/5 hover:bg-[#1C130B]/10 text-[#1C130B] transition-all"
              title="Open full size"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => resultUrl && downloadImage(resultUrl, `${designItem?.title || 'visualization'}.jpg`)}
              className="p-2 rounded-xl bg-[#1C130B]/5 hover:bg-[#1C130B]/10 text-[#1C130B] transition-all"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-xl bg-[#1C130B]/5 hover:bg-[#1C130B]/10 text-[#1C130B] transition-all"
              title="Try another photo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1C130B]/5 hover:bg-[#1C130B]/10 text-[#1C130B] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Before/After Slider */}
        <div className="flex-1 relative overflow-hidden" ref={sliderRef}>
          {/* After (AI result) - full background */}
          {resultUrl && (
            <Image
              src={resultUrl}
              alt={`AI restyled: ${designItem?.title || 'room'}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}

          {/* Before (original) - clipped */}
          {originalPreview && (
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={originalPreview}
                alt="Original room photo"
                fill
                className="object-cover grayscale-[0.2]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100/30 via-gray-200/20 to-gray-300/30 pointer-events-none" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#1C130B]/80 text-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded-2xl backdrop-blur-sm">
                  Original
                </span>
              </div>
            </div>
          )}

          {/* After label */}
          <div className="absolute top-4 right-4">
            <span className="bg-[#C5A880] text-[#1C130B] text-xs font-semibold px-3 py-1.5 rounded-2xl flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Restyled
            </span>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/90 z-10 pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 3L14 8L11 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Invisible drag area */}
          <div
            className="absolute inset-0 cursor-ew-resize touch-none"
            onMouseDown={(e) => startDrag(e.clientX)}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
          />
        </div>

        {/* Use This Look CTA */}
        {designItem && onUseLook && resultUrl && (
          <div className="p-4 border-t border-[#1C130B]/10 flex-shrink-0">
            <button
              onClick={() => {
                onUseLook({ ...designItem, restyledUrl: resultUrl });
                onClose();
              }}
              className="w-full bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] py-3 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Use This Look — Continue to Estimator
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  function startDrag(clientX: number) {
    const win = window as { __visualizeSliderEl?: HTMLDivElement };
    const sliderEl = win.__visualizeSliderEl;
    if (!sliderEl) return;

    const move = (x: number) => {
      const rect = sliderEl.getBoundingClientRect();
      const pos = Math.max(0, Math.min(x - rect.left, rect.width));
      setSliderPosition((pos / rect.width) * 100);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      move(x);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleUp);

    move(clientX);
  }

  function downloadImage(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}