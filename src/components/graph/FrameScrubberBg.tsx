'use client';

import React, { useEffect, useRef } from 'react';

interface FrameScrubberBgProps {
  visibility: 'visible' | 'dimmed' | 'hidden';
}

export function FrameScrubberBg({ visibility }: FrameScrubberBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (visibility === 'hidden') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      step += 0.008;

      // Draw subtle animated wave grid representing video frame scrubbing / temporal flow
      ctx.lineWidth = 1;
      const opacity = visibility === 'dimmed' ? 0.04 : 0.12;

      for (let y = 40; y < height; y += 60) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;

        for (let x = 0; x < width; x += 10) {
          const waveY = y + Math.sin(x * 0.005 + step + y * 0.01) * 18;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // Draw moving timeline scrubber vertical indicator
      const scrubberX = (Math.sin(step * 0.5) * 0.4 + 0.5) * width;
      ctx.beginPath();
      ctx.moveTo(scrubberX, 0);
      ctx.lineTo(scrubberX, height);
      ctx.strokeStyle = `rgba(56, 189, 248, ${visibility === 'dimmed' ? 0.08 : 0.25})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [visibility]);

  if (visibility === 'hidden') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 z-0"
    />
  );
}
