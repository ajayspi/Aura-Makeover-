"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, UploadCloud, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

const STYLES = [
  { id: 'botanical', label: 'Botanical Wallpaper', prompt: 'Luxury living room with tropical botanical wallpaper, warm ambient lighting, elegant furniture, photorealistic' },
  { id: 'louvers', label: 'Fluted Walnut Louvers', prompt: 'Modern luxury room with acoustic fluted walnut wood louvers on walls, warm LED strip lighting, high-end interior design' },
  { id: 'neoclassical', label: 'Neo-Classical Paneling', prompt: 'Classic luxury room with white neo-classical wainscoting and wall molding panels, elegant chandelier, bright and airy' },
  { id: 'pichwai', label: 'Temple Pichwai', prompt: 'Indian luxury room featuring traditional hand-painted Pichwai art mural on the wall, brass accents, warm rich lighting' },
];

export default function AIRestyleStudio() {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'done'>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Resize and compress image to base64
  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setOriginalImage(URL.createObjectURL(file));
        
        // Remove the data:image/jpeg;base64, prefix for the API
        const base64Data = dataUrl.split(',')[1];
        setBase64Image(base64Data);
        setStep('preview');
        setError(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const generateRestyle = async () => {
    if (!base64Image) return;
    setStep('processing');
    setError(null);

    try {
      const res = await fetch('/api/ai/restyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          prompt: selectedStyle.prompt,
          strength: 0.65, // Let AI change textures but keep structure
        }),
      });

      if (!res.ok) throw new Error('Failed to start generation');
      const data = await res.json();
      
      // Poll for completion
      pollJob(data.jobId);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the AI engine. Please try again.');
      setStep('preview');
    }
  };

  const pollJob = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai/restyle/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status === 'done') {
          clearInterval(pollInterval);
          setResultImage(data.resultUrl);
          setStep('done');
        } else if (data.status === 'failed') {
          clearInterval(pollInterval);
          setError('Generation failed. Please try another image.');
          setStep('preview');
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  };

  // Slider controls
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingSlider.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingSlider.current) return;
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerUp = useCallback(() => {
    isDraggingSlider.current = false;
  }, []);

  return (
    <main className="min-h-screen pt-[88px] md:pt-[104px] bg-[#1C130B] flex flex-col text-[#FAF8F5] font-['Plus_Jakarta_Sans']">
      
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-[#C5A880]/10 shrink-0">
        <Link href="/" className="flex items-center gap-2 text-[#FAF8F5]/70 hover:text-[#C5A880] transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-xs sm:text-sm">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center">
            <span className="text-[#1C130B] font-bold font-['Syne'] text-sm sm:text-base">A</span>
          </div>
          <span className="font-['Syne'] font-black text-lg sm:text-xl tracking-tight">
            AI <span className="text-[#C5A880]">Studio</span>
          </span>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative">
        <AnimatePresence mode="wait">
          
          {/* UPLOAD STATE */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl text-center mt-8 sm:mt-0"
            >
              <h1 className="font-['Syne'] text-3xl sm:text-5xl font-black mb-3 sm:mb-4">See the Future of your Space</h1>
              <p className="text-[#FAF8F5]/60 mb-8 sm:mb-10 text-sm sm:text-base px-2">Upload a photo of your raw or builder-finish room. Our AI will instantly map luxury finishes to your exact walls.</p>
              
              <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="block w-full border-2 border-dashed border-[#C5A880]/30 hover:border-[#C5A880] rounded-3xl bg-[#FAF8F5]/5 hover:bg-[#FAF8F5]/10 p-12 transition-all cursor-pointer group"
              >
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className="w-20 h-20 mx-auto rounded-full bg-[#C5A880]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-[#C5A880]" />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold mb-2">Drag & Drop Image</h3>
                <p className="text-sm text-[#FAF8F5]/50">or click to browse your files (JPG, PNG)</p>
              </label>
            </motion.div>
          )}

          {/* PREVIEW & STYLE SELECTION STATE */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/20 bg-black">
                {originalImage && (
                  <Image src={originalImage} alt="Original Room" fill className="object-contain" />
                )}
                <button onClick={() => setStep('upload')} className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold hover:bg-black/80 transition-colors">
                  Change Image
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="font-['Syne'] text-3xl font-bold mb-2">Select Architectural Style</h2>
                  <p className="text-[#FAF8F5]/60 text-sm">Choose a signature AuroMakeover finish tier.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedStyle.id === style.id 
                          ? 'border-[#C5A880] bg-[#C5A880]/10 shadow-[0_0_20px_rgba(197,168,128,0.2)]' 
                          : 'border-[#FAF8F5]/10 hover:border-[#FAF8F5]/30'
                      }`}
                    >
                      <ImageIcon className={`w-5 h-5 mb-3 ${selectedStyle.id === style.id ? 'text-[#C5A880]' : 'text-[#FAF8F5]/40'}`} />
                      <h4 className="font-bold text-sm">{style.label}</h4>
                    </button>
                  ))}
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={generateRestyle}
                  className="w-full bg-[#C5A880] hover:bg-[#FAF8F5] text-[#1C130B] font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Luxury Rendering
                </button>
              </div>
            </motion.div>
          )}

          {/* PROCESSING STATE */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md text-center space-y-6"
            >
              <div className="relative w-32 h-32 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#C5A880]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#C5A880] animate-pulse" />
                </div>
              </div>
              <h2 className="font-['Syne'] text-2xl font-bold">Rendering Space...</h2>
              <p className="text-[#FAF8F5]/60 text-sm">Applying {selectedStyle.label}. This usually takes 5-10 seconds.</p>
            </motion.div>
          )}

          {/* DONE STATE (BEFORE / AFTER) */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-6xl"
            >
              <div className="text-center mb-8">
                <h2 className="font-['Syne'] text-3xl font-bold mb-2">Your Space, Transformed.</h2>
                <p className="text-[#C5A880] font-semibold">{selectedStyle.label}</p>
              </div>

              <div
                ref={sliderContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full aspect-[4/3] lg:aspect-[16/9] rounded-3xl overflow-hidden cursor-ew-resize select-none touch-none border border-[#C5A880]/20 shadow-2xl"
              >
                {/* After Image */}
                {resultImage && (
                  <Image src={resultImage} alt="After" fill className="object-cover" />
                )}

                {/* Before Image (clipped) */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  {originalImage && (
                    <Image src={originalImage} alt="Before" fill className="object-cover grayscale-[0.2]" />
                  )}
                  <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold">
                    Builder Finish
                  </div>
                </div>

                <div className="absolute top-5 right-5 bg-[#C5A880] text-[#1C130B] px-4 py-2 rounded-full text-xs font-bold">
                  {selectedStyle.label}
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/90 z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5 3L2 8L5 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11 3L14 8L11 13" stroke="#1C130B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center gap-4">
                <button onClick={() => { setStep('upload'); setOriginalImage(null); setBase64Image(null); setResultImage(null); }} className="px-6 py-3 rounded-xl border border-[#FAF8F5]/20 hover:bg-[#FAF8F5]/10 font-bold text-sm transition-colors">
                  Try Another Photo
                </button>
                <Link href="/#estimator" className="bg-[#15803D] hover:bg-[#166534] text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-colors">
                  Get a Quote for this Look
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
