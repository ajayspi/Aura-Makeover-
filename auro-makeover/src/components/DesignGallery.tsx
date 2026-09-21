"use client";

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface DesignItem {
  id: number;
  title: string;
  category: "Botanical" | "Fluted Louver" | "Neo-Classical" | "Temple Pichwai";
  description: string;
  image: string;
  tags: string[];
  installTime: string;
}

export const CATEGORIES = [
  "All",
  "Botanical",
  "Fluted Louver",
  "Neo-Classical",
  "Temple Pichwai"
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const DESIGNS: DesignItem[] = [
  {
    id: 1,
    title: "Emerald Monstera Sanctuary",
    category: "Botanical",
    description: "Deep emerald tropical monstera leaves with brushed brass vein accents on woven canvas.",
    image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=1200&auto=format&fit=crop&q=80",
    tags: ["Waterproof", "Living Room", "Anti-Fungal"],
    installTime: "48h Ready",
  },
  {
    id: 2,
    title: "Misty Palm Oasis",
    category: "Botanical",
    description: "Eucalyptus watercolor wash on textured linen silk, bringing coastal morning tranquility.",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&auto=format&fit=crop&q=80",
    tags: ["Linen Silk", "Master Suite", "Seamless"],
    installTime: "48h Ready",
  },
  {
    id: 3,
    title: "Acoustic Smoked Walnut",
    category: "Fluted Louver",
    description: "Sound-dampening architectural timber slats mounted on recycled charcoal felt backing.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80",
    tags: ["NRC 0.85 Acoustic", "TV Media Wall", "Zero Dust"],
    installTime: "48h Ready",
  },
  {
    id: 4,
    title: "Nordic Teak Fluted Wall",
    category: "Fluted Louver",
    description: "Architectural honey-teak fluted profiles with integrated channel for warm indirect LEDs.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    tags: ["Honey Teak", "Foyer Entry", "Zero Civil Work"],
    installTime: "48h Ready",
  },
  {
    id: 5,
    title: "Versailles Moulding & Gold",
    category: "Neo-Classical",
    description: "Haussmannian boiserie wall mouldings finished in soft alabaster with antique gold leaf trims.",
    image: "https://images.unsplash.com/photo-1595514535313-09419b4566c1?w=1200&auto=format&fit=crop&q=80",
    tags: ["Parisian Boiserie", "Dining Room", "Gold Foil"],
    installTime: "48h Ready",
  },
  {
    id: 6,
    title: "Florentine Damask Silk",
    category: "Neo-Classical",
    description: "Pearlescent champagne embossed damask with rich tactile weave reflecting ambient light.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80",
    tags: ["Embossed Silk", "Bedhead Wall", "Washable"],
    installTime: "48h Ready",
  },
  {
    id: 7,
    title: "Lotus Pond Shrinathji Pichwai",
    category: "Temple Pichwai",
    description: "Sacred Shrinathji lotus sanctuary rendered with natural mineral pigments on raw tussar silk.",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&auto=format&fit=crop&q=80",
    tags: ["Natural Pigments", "Pooja Sanctuary", "Heritage"],
    installTime: "48h Ready",
  },
  {
    id: 8,
    title: "Vrindavan Mayur Royal Pichwai",
    category: "Temple Pichwai",
    description: "Handcrafted royal dancing peacocks under Kadamba boughs with real 24k gold foil highlights.",
    image: "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?w=1200&auto=format&fit=crop&q=80",
    tags: ["24k Gold Leaf", "Mandir Feature", "Handcrafted"],
    installTime: "48h Ready",
  },
];

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 22 });

  // 3D tilt angles calculated from normalized mouse offsets
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function DesignGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");

  const filteredDesigns = activeCategory === "All"
    ? DESIGNS
    : DESIGNS.filter(d => d.category === activeCategory);

  const handleSelectDesign = (design: DesignItem) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auro:select-design', {
          detail: { design: design.title, category: design.category },
        })
      );
      const estimatorEl = document.getElementById('estimator');
      if (estimatorEl) {
        estimatorEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
      {/* Header & Category Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-[#8A5836] font-bold uppercase tracking-wider text-xs md:text-sm mb-3">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Curated High-Rise Collections</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-['Syne'] text-[#1C130B] tracking-tight leading-[1.1]">
            Architectural Finishes
          </h2>
          <p className="mt-3 text-[#1C130B]/70 text-sm md:text-base font-normal leading-relaxed">
            Pre-tested for Hyderabad high-rise drywall and gypsum finishes. Installed in 48 hours with zero civil dust and zero HOA hassles.
          </p>
        </div>

        {/* Animated Filter Pill Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF8F5] border border-[#C5A880]/30 rounded-full overflow-x-auto max-w-full hide-scrollbar shadow-sm">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-colors cursor-pointer select-none whitespace-nowrap ${
                  isActive ? 'text-[#FAF8F5]' : 'text-[#1C130B]/70 hover:text-[#1C130B]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="galleryActiveCategory"
                    className="absolute inset-0 bg-[#1C130B] rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry-Style Grid with Alternating Aspect Ratios */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredDesigns.map((design, index) => {
            // Alternating heights: aspect-[4/5] for odd cards (1st, 3rd...), aspect-[3/4] for even cards (2nd, 4th...)
            const isEvenCard = index % 2 === 1;
            const aspectClass = isEvenCard ? "aspect-[3/4]" : "aspect-[4/5]";

            return (
              <motion.div
                key={design.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                <TiltCard
                  onClick={() => handleSelectDesign(design)}
                  className={`group relative rounded-3xl overflow-hidden ${aspectClass} bg-[#1C130B] shadow-md hover:shadow-2xl transition-shadow duration-500 cursor-pointer border border-[#C5A880]/20 hover:border-[#C5A880]`}
                >
                  {/* Next.js Optimized Image with Fill */}
                  <Image
                    src={design.image}
                    alt={design.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Backing for Deep Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B] via-[#1C130B]/45 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Floating Top Badge */}
                  <div
                    style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                    className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none"
                  >
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#1C130B]/80 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/30 shadow-sm">
                      {design.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F5]/90 backdrop-blur-sm text-[#1C130B] shadow-sm">
                      {design.installTime}
                    </span>
                  </div>

                  {/* Floating Content at Card Bottom */}
                  <div
                    style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}
                    className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end"
                  >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {design.tags.slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-full bg-[#FAF8F5]/15 backdrop-blur-md text-[#FAF8F5] text-[10px] font-medium tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-[#FAF8F5] text-xl font-bold font-['Syne'] leading-snug mb-2 group-hover:text-[#C5A880] transition-colors">
                      {design.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-[#FAF8F5]/75 text-xs line-clamp-2 leading-relaxed mb-4">
                      {design.description}
                    </p>

                    {/* Action trigger */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs font-bold text-[#C5A880] flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
                        Estimate In My Flat
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#1C130B] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#FAF8F5]">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Trust Subtext */}
      <div className="mt-12 text-center">
        <p className="text-xs md:text-sm text-[#1C130B]/60 font-['Plus_Jakarta_Sans'] inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
          All 8 curated designs are stocked locally in HITEC City hub for guaranteed 48-hour deployment.
        </p>
      </div>
    </section>
  );
}

export { DesignGallery };
