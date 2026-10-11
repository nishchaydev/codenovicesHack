'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;

export function BackgroundCanvas({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHeroRef = useRef<HTMLCanvasElement>(null);
  const canvasDashRef = useRef<HTMLCanvasElement>(null);

  const heroBitmapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const dashBitmapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);

  const lastHeroIndexRef = useRef<number>(-1);
  const lastDashIndexRef = useRef<number>(-1);
  const lastProgressRef = useRef<number>(-1);

  // Parallax animation state
  const mouseTargetX = useRef<number>(0);
  const mouseTargetY = useRef<number>(0);
  const mouseCurrentX = useRef<number>(0);
  const mouseCurrentY = useRef<number>(0);
  const rafParallaxIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasHero = canvasHeroRef.current;
    const canvasDash = canvasDashRef.current;
    if (!canvasHero || !canvasDash) return;

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvasHero) {
        canvasHero.width = w;
        canvasHero.height = h;
      }
      if (canvasDash) {
        canvasDash.width = w;
        canvasDash.height = h;
      }
    };
    updateCanvasDimensions();

    // Helper: Draw image scaled with object-cover on canvas using non-alpha context
    const drawCoverImage = (
      canvas: HTMLCanvasElement,
      img: ImageBitmap | HTMLImageElement | undefined
    ) => {
      if (!img) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const naturalW = 'width' in img ? img.width : (img as HTMLImageElement).naturalWidth;
      const naturalH = 'height' in img ? img.height : (img as HTMLImageElement).naturalHeight;
      if (!naturalW || !naturalH) return;

      const hRatio = w / naturalW;
      const vRatio = h / naturalH;
      const ratio = Math.max(hRatio, vRatio);
      const shiftX = (w - naturalW * ratio) / 2;
      const shiftY = (h - naturalH * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        naturalW,
        naturalH,
        shiftX,
        shiftY,
        naturalW * ratio,
        naturalH * ratio
      );
    };

    // Preload Hero Frames (1 to 120) into ImageBitmap
    const loadedHero: (ImageBitmap | HTMLImageElement)[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(4, '0');
      img.src = `/frames/hero/frame_${padded}.jpg`;
      img.onload = () => {
        if ('createImageBitmap' in window) {
          createImageBitmap(img).then((bitmap) => {
            loadedHero[i - 1] = bitmap;
            if (i === 1 && canvasHeroRef.current) {
              drawCoverImage(canvasHeroRef.current, bitmap);
            }
          }).catch(() => {
            loadedHero[i - 1] = img;
          });
        } else {
          loadedHero[i - 1] = img;
          if (i === 1 && canvasHeroRef.current) {
            drawCoverImage(canvasHeroRef.current, img);
          }
        }
      };
      loadedHero.push(img);
    }
    heroBitmapsRef.current = loadedHero;

    // Preload Cascade Frames (1 to 120) into ImageBitmap
    const loadedDash: (ImageBitmap | HTMLImageElement)[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(4, '0');
      img.src = `/frames/dash/frame_${padded}.jpg`;
      img.onload = () => {
        if ('createImageBitmap' in window) {
          createImageBitmap(img).then((bitmap) => {
            loadedDash[i - 1] = bitmap;
            if (i === 1 && canvasDashRef.current) {
              drawCoverImage(canvasDashRef.current, bitmap);
            }
          }).catch(() => {
            loadedDash[i - 1] = img;
          });
        } else {
          loadedDash[i - 1] = img;
          if (i === 1 && canvasDashRef.current) {
            drawCoverImage(canvasDashRef.current, img);
          }
        }
      };
      loadedDash.push(img);
    }
    dashBitmapsRef.current = loadedDash;

    // Render frame based on scroll progress (0.0 to 1.0)
    const renderAtProgress = (progress: number) => {
      const cHero = canvasHeroRef.current;
      const cDash = canvasDashRef.current;
      if (!cHero || !cDash) return;

      let heroOpacity = 1;
      let dashOpacity = 0;

      if (progress <= 0.40) {
        // 0.00 to 0.40: Scrub Sequence A (Hero)
        const normA = progress / 0.40;
        const heroIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(normA * (TOTAL_FRAMES - 1))));
        heroOpacity = 1;
        dashOpacity = 0;

        if (heroIndex !== lastHeroIndexRef.current) {
          lastHeroIndexRef.current = heroIndex;
          drawCoverImage(cHero, heroBitmapsRef.current[heroIndex]);
        }
      } else if (progress < 0.60) {
        // 0.40 to 0.60: Cross-Fade Zone
        const fade = (progress - 0.40) / 0.20;
        heroOpacity = 1 - fade;
        dashOpacity = fade;

        const heroIndex = TOTAL_FRAMES - 1;
        const dashIndex = 0;

        if (heroIndex !== lastHeroIndexRef.current) {
          lastHeroIndexRef.current = heroIndex;
          drawCoverImage(cHero, heroBitmapsRef.current[heroIndex]);
        }
        if (dashIndex !== lastDashIndexRef.current) {
          lastDashIndexRef.current = dashIndex;
          drawCoverImage(cDash, dashBitmapsRef.current[dashIndex]);
        }
      } else {
        // 0.60 to 1.00: Scrub Sequence B (Dash / Cascade)
        const normB = (progress - 0.60) / 0.40;
        const dashIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(normB * (TOTAL_FRAMES - 1))));
        heroOpacity = 0;
        dashOpacity = 1;

        if (dashIndex !== lastDashIndexRef.current) {
          lastDashIndexRef.current = dashIndex;
          drawCoverImage(cDash, dashBitmapsRef.current[dashIndex]);
        }
      }

      cHero.style.opacity = heroOpacity.toString();
      cDash.style.opacity = dashOpacity.toString();
    };

    // Resize Handler
    const handleResize = () => {
      updateCanvasDimensions();
      lastHeroIndexRef.current = -1;
      lastDashIndexRef.current = -1;
      renderAtProgress(lastProgressRef.current >= 0 ? lastProgressRef.current : 0);
    };
    window.addEventListener('resize', handleResize);

    // Mousemove Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseTargetX.current = (e.clientX - centerX) * 0.015;
      mouseTargetY.current = (e.clientY - centerY) * 0.015;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Parallax Animation Loop
    const updateParallax = () => {
      mouseCurrentX.current += (mouseTargetX.current - mouseCurrentX.current) * 0.1;
      mouseCurrentY.current += (mouseTargetY.current - mouseCurrentY.current) * 0.1;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${mouseCurrentX.current.toFixed(2)}px, ${mouseCurrentY.current.toFixed(2)}px, 0px)`;
      }
      rafParallaxIdRef.current = requestAnimationFrame(updateParallax);
    };
    rafParallaxIdRef.current = requestAnimationFrame(updateParallax);

    // Bind GSAP ScrollTrigger to #page-scroll-container
    const scrollContainer = document.getElementById('page-scroll-container') || document.body;
    const st = ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        if (Math.abs(p - lastProgressRef.current) > 0.0001) {
          lastProgressRef.current = p;
          renderAtProgress(p);
        }
      },
    });

    // Initial Render
    renderAtProgress(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafParallaxIdRef.current !== null) {
        cancelAnimationFrame(rafParallaxIdRef.current);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden [transform:translateZ(0)] ${className}`}
    >
      <canvas
        ref={canvasHeroRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
      />
      <canvas
        ref={canvasDashRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
      />
    </div>
  );
}


