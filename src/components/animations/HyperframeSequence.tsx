"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap, mediaQs } from '@/lib/gsap';

interface HyperframeSequenceProps {
  frameCount: number;
  framePath: (index: number) => string;
  triggerHeight?: string; // e.g. "300vh"
  className?: string;
  fallbackImage?: string; // Fallback for mobile/reduced motion
}

export default function HyperframeSequence({ 
  frameCount, 
  framePath, 
  triggerHeight = "300vh",
  className = "",
  fallbackImage
}: HyperframeSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Preload images
  useEffect(() => {
    // Check if we should fallback (mobile or reduced motion)
    const matchMedia = window.matchMedia(mediaQs.mobile);
    const reducedMotion = window.matchMedia(mediaQs.reducedMotion);
    
    if (matchMedia.matches || reducedMotion.matches) {
      setIsMobile(true);
      return;
    }

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, [frameCount, framePath]);

  useGSAP(() => {
    if (isMobile || !canvasRef.current || images.length === 0) return;
    registerGsap();
    
    const playhead = { frame: 0 };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw initial frame
    if (ctx && images[0]) {
      ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    }

    gsap.to(playhead, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Smooth scrubbing
      },
      onUpdate: () => {
        if (ctx && images[playhead.frame]) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[playhead.frame], 0, 0, canvas.width, canvas.height);
        }
      }
    });
  }, { scope: containerRef, dependencies: [images, isMobile] });

  // Fallback for mobile or while loading
  if (isMobile || images.length === 0) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`} style={{ height: "100vh" }}>
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt="Sequence fallback" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: triggerHeight }} className={`relative w-full ${className}`}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* We use standard 1920x1080 for HD sequences, scale to cover */}
        <canvas 
          ref={canvasRef} 
          className="object-cover w-full h-full" 
          width={1920} 
          height={1080} 
        />
      </div>
    </div>
  );
}
