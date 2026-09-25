"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import VisualizeRoom from './VisualizeRoom';
import { designToEstimatorPrefill } from '@/lib/quiz-to-tags';
import { CityConfig } from '@/lib/cities';

const CATEGORIES = ['All', 'Botanical', 'Fluted Louver', 'Neo-Classical', 'Temple Pichwai'];

const DESIGNS = [
  { id: 1, title: 'Emerald Monstera', category: 'Botanical', image: '/images/botanical.jpg', room: 'Living Room' },
  { id: 2, title: 'Acoustic Walnut Slats', category: 'Fluted Louver', image: '/images/fluted-louver.jpg', room: 'TV Media Wall' },
  { id: 3, title: 'Versailles Gold', category: 'Neo-Classical', image: '/images/neoclassical.jpg', room: 'Master Bedroom' },
  { id: 4, title: 'Krishna Leela', category: 'Temple Pichwai', image: '/images/pichwai.jpg', room: 'Pooja Room' },
  { id: 5, title: 'Tropical Palm Oasis', category: 'Botanical', image: '/images/after.jpg', room: 'Guest Bedroom' },
  { id: 6, title: 'Nordic Teak Panels', category: 'Fluted Louver', image: '/images/hero.jpg', room: 'Living Room' },
  { id: 7, title: 'Rococo Ivory Panels', category: 'Neo-Classical', image: '/images/neoclassical.jpg', room: 'Dining Nook' },
  { id: 8, title: 'Lotus Pond Pichwai', category: 'Temple Pichwai', image: '/images/pichwai.jpg', room: 'Pooja Corridor' },
];

type Design = (typeof DESIGNS)[number];

function GalleryCard({ item, index, onVisualize, onShopLook }: { item: Design; index: number; onVisualize: (item: Design) => void; onShopLook: (item: Design) => void }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`group relative rounded-2xl overflow-hidden ${index % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'} bg-[#1C130B] cursor-pointer [perspective:900px]`}
      >
        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/80 via-[#1C130B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="bg-[#1C130B]/70 text-[#FAF8F5] text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide uppercase">{item.category}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-[#FAF8F5] text-lg font-semibold tracking-[-0.01em] mb-1">{item.title}</h3>
          <p className="text-[#FAF8F5]/60 text-xs font-medium mb-3">{item.room}</p>
          <button onClick={(e) => { e.stopPropagation(); onVisualize(item); }} className="w-full bg-[#C5A880] hover:bg-[#b8996f] text-[#1C130B] py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5"/><path d="M16 7l-4 4 4 4"/><path d="M12 17v5"/><path d="M8 17l4 4 4-4"/></svg>
            Visualize in My Room
          </button>
          <button onClick={(e) => { e.stopPropagation(); onShopLook(item); }} className="w-full mt-2 bg-[#1C130B] hover:bg-[#8A5836] text-[#FAF8F5] py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
            Shop This Look →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface DesignGalleryProps {
  city?: CityConfig;
}

export default function DesignGallery({ city }: DesignGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visualizeItem, setVisualizeItem] = useState<Design | null>(null);

  const filteredDesigns = activeCategory === 'All' ? DESIGNS : DESIGNS.filter((d) => d.category === activeCategory);

  const handleVisualize = (item: Design) => setVisualizeItem(item);
  const handleVisualizeClose = () => setVisualizeItem(null);

  const handleShopLook = (item: Design) => {
    const prefill = designToEstimatorPrefill(item);
    sessionStorage.setItem('estimator_prefill', JSON.stringify(prefill));
    window.location.href = `/#estimator?prefill=${encodeURIComponent(JSON.stringify(prefill))}`;
  };

  const handleUseLook = (item: { id: number; title: string; category: string; restyledUrl: string; image?: string; room?: string }) => {
    sessionStorage.setItem('estimator_prefill', JSON.stringify({
      roomType: 'living', finishTier: 'premium', categories: [item.category], features: ['feature-wallpaper'],
      restyledImage: item.restyledUrl,
    }));
    window.location.href = `/#estimator?prefill=${encodeURIComponent(JSON.stringify({
      roomType: 'living', finishTier: 'premium', categories: [item.category], features: ['feature-wallpaper'],
      restyledImage: item.restyledUrl,
    }))}`;
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="max-w-lg">
            <p className="text-[#8A5836] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Collections</p>
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#1C130B] tracking-[-0.02em] leading-[1.15]">Architectural finishes</h2>
            <p className="mt-3 text-[#1C130B]/50 text-sm font-normal leading-relaxed font-['Plus_Jakarta_Sans']">Pre-tested for {city?.name || 'Hyderabad'} high-rise drywall. Installed in 48 hours.</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${activeCategory === cat ? 'bg-[#1C130B] text-[#FAF8F5]' : 'bg-[#1C130B]/5 text-[#1C130B]/50 hover:text-[#1C130B]'}`}>{cat}</button>
            ))}
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>{filteredDesigns.map((item, index) => <GalleryCard key={item.id} item={item} index={index} onVisualize={handleVisualize} onShopLook={handleShopLook} />)}</AnimatePresence>
        </div>
      </div>
      <AnimatePresence>{visualizeItem && <VisualizeRoom designItem={visualizeItem} onClose={handleVisualizeClose} onUseLook={handleUseLook} />}</AnimatePresence>
    </section>
  );
}
