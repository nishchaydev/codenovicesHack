'use client';

import React, { useEffect, useRef } from 'react';

interface DashBackgroundCanvasProps {
  className?: string;
  opacity?: number;
}

const TOTAL_FRAMES = 120;

export function DashBackgroundCanvas({ className = '', opacity = 0.2 }: DashBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Preload dash frames
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, '0');
      img.src = `/frames/dash/frame_${numStr}.jpg`;
      images.push(img);
    }
    framesRef.current = images;

    // Slow ambient loop through dashboard sequence frames
    let lastTime = performance.now();
    const fpsInterval = 1000 / 24; // 24 fps playback

    const render = (time: number) => {
      const elapsed = time - lastTime;

      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);

        const currentFrame = framesRef.current[frameIndexRef.current];
        if (currentFrame && currentFrame.complete && currentFrame.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = opacity;

          // Aspect cover drawing
          const hRatio = canvas.width / currentFrame.naturalWidth;
          const vRatio = canvas.height / currentFrame.naturalHeight;
          const ratio = Math.max(hRatio, vRatio);
          const centerShiftX = (canvas.width - currentFrame.naturalWidth * ratio) / 2;
          const centerShiftY = (canvas.height - currentFrame.naturalHeight * ratio) / 2;

          ctx.drawImage(
            currentFrame,
            0,
            0,
            currentFrame.naturalWidth,
            currentFrame.naturalHeight,
            centerShiftX,
            centerShiftY,
            currentFrame.naturalWidth * ratio,
            currentFrame.naturalHeight * ratio
          );
        }

        frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
