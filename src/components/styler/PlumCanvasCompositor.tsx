"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface Point2D {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
}

export interface PlumCanvasCompositorProps {
  baseImage: string;
  tintColor: string; // Hex color string (e.g. '#7D8471')
  wallPolygon?: Point2D[];
  polygons?: Point2D[][]; // Support compound/multiple polygons (e.g. upper + lower cabinets)
  isNightMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoaded?: () => void;
  alt?: string;
}

// In-memory image cache to guarantee 0ms instant repaint on color change
const imageCache = new Map<string, HTMLImageElement>();

export default function PlumCanvasCompositor({
  baseImage,
  tintColor,
  wallPolygon = [
    { x: 15, y: 10 },
    { x: 85, y: 10 },
    { x: 85, y: 90 },
    { x: 15, y: 90 },
  ],
  polygons,
  isNightMode = false,
  className = '',
  style,
  onLoaded,
  alt = "Plum Room Compositor Viewport"
}: PlumCanvasCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Render pipeline
  const renderComposite = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = imageCache.get(baseImage);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    // Retina / High-DPI buffer scaling
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Master Base Image (object-cover positioning)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW = w;
    let drawH = h;
    let drawX = 0;
    let drawY = 0;

    if (canvasRatio > imgRatio) {
      drawW = w;
      drawH = w / imgRatio;
      drawY = (h - drawH) / 2;
    } else {
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // 2. Vector Polygon Mask Clipping & Dynamic Colorama Tinting Pass
    const activePolygons: Point2D[][] =
      polygons && polygons.length > 0
        ? polygons
        : wallPolygon && wallPolygon.length >= 3
        ? [wallPolygon]
        : [];

    if (tintColor && activePolygons.length > 0) {
      for (const poly of activePolygons) {
        if (!poly || poly.length < 3) continue;
        ctx.save();

        // Begin vector polygon path
        ctx.beginPath();
        const firstPt = poly[0];
        ctx.moveTo((firstPt.x / 100) * w, (firstPt.y / 100) * h);

        for (let i = 1; i < poly.length; i++) {
          const pt = poly[i];
          ctx.lineTo((pt.x / 100) * w, (pt.y / 100) * h);
        }
        ctx.closePath();
        ctx.clip();

        // Pass A: Multiply Blend (preserves 3D flute shadows, relief depth & contact shadows)
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = tintColor;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(0, 0, w, h);

        // Pass B: Color / Tint Blend (tints highlights and midtones authentically)
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = tintColor;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(0, 0, w, h);

        ctx.restore();
      }
    }

    // 3. Specular Lighting & 3000K Cove Glow Pass (Night Mode simulation)
    if (isNightMode) {
      ctx.save();

      // Evening vignette & contrast enhancement
      ctx.globalCompositeOperation = 'multiply';
      const ambientVignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.45,
        w * 0.25,
        w * 0.5,
        h * 0.45,
        Math.max(w, h) * 0.75
      );
      ambientVignette.addColorStop(0, 'rgba(255, 255, 255, 1)');
      ambientVignette.addColorStop(1, 'rgba(25, 16, 9, 0.78)');
      ctx.fillStyle = ambientVignette;
      ctx.fillRect(0, 0, w, h);

      // 3000K warm cove halo along the ceiling
      ctx.globalCompositeOperation = 'screen';
      const coveGlow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.08,
        15,
        w * 0.5,
        h * 0.28,
        Math.max(w, h) * 0.65
      );
      coveGlow.addColorStop(0, 'rgba(255, 215, 130, 0.60)');
      coveGlow.addColorStop(0.4, 'rgba(197, 168, 128, 0.35)');
      coveGlow.addColorStop(1, 'rgba(28, 19, 11, 0)');
      ctx.fillStyle = coveGlow;
      ctx.fillRect(0, 0, w, h);

      // Linear ceiling ledge illumination strip
      const stripGlow = ctx.createLinearGradient(0, 0, 0, h * 0.2);
      stripGlow.addColorStop(0, 'rgba(255, 210, 120, 0.50)');
      stripGlow.addColorStop(1, 'rgba(255, 200, 110, 0)');
      ctx.fillStyle = stripGlow;
      ctx.fillRect(0, 0, w, h * 0.2);

      ctx.restore();
    }

    ctx.restore();
  }, [baseImage, tintColor, wallPolygon, polygons, isNightMode]);

  // Load and cache master base image
  useEffect(() => {
    let isCancelled = false;

    if (imageCache.has(baseImage)) {
      const cachedImg = imageCache.get(baseImage)!;
      if (cachedImg.complete) {
        requestAnimationFrame(() => {
          if (isCancelled) return;
          setImageLoaded(true);
          setHasError(false);
          renderComposite();
          onLoaded?.();
        });
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = baseImage;

    img.onload = () => {
      if (isCancelled) return;
      imageCache.set(baseImage, img);
      setImageLoaded(true);
      setHasError(false);
      renderComposite();
      onLoaded?.();
    };

    img.onerror = () => {
      if (isCancelled) return;
      setHasError(true);
      setImageLoaded(false);
    };

    return () => {
      isCancelled = true;
    };
  }, [baseImage, onLoaded, renderComposite]);

  // Re-composite when props change or container resizes
  useEffect(() => {
    if (!imageLoaded) return;
    renderComposite();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      renderComposite();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [imageLoaded, renderComposite]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className="w-full h-full block object-cover"
      />

      {/* Loading state indicator */}
      {!imageLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1C130B]/80 text-[#C5A880] text-xs font-semibold tracking-wider font-['Plus_Jakarta_Sans']">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] animate-ping" />
            <span>CALIBRATING OPTICAL COMPOSITOR...</span>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1C130B] text-white/60 text-xs">
          Unable to load preview asset.
        </div>
      )}
    </div>
  );
}
