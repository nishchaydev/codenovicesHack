'use client';

import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 240;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  color: string;
}

export function HeroCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  useEffect(() => {
    // Preload video frames
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(4, '0');
      img.src = `/frames/hero/frame_${paddedIndex}.jpg`;
      loadedImages.push(img);
    }
    framesRef.current = loadedImages;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic graph nodes overlay
    const nodeCount = 30;
    const colors = ['#6366f1', '#38bdf8', '#f59e0b', '#ec4899', '#10b981'];
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 3 + 2,
      pulse: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let lastTime = performance.now();
    const fps = 24;
    const interval = 1000 / fps;

    const render = (now: number) => {
      const delta = now - lastTime;
      if (delta >= interval) {
        lastTime = now - (delta % interval);
        currentFrameRef.current = (currentFrameRef.current + 1) % TOTAL_FRAMES;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Video Frame
      const currentImg = framesRef.current[currentFrameRef.current];
      if (currentImg && currentImg.complete && currentImg.naturalWidth !== 0) {
        const hRatio = width / currentImg.naturalWidth;
        const vRatio = height / currentImg.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (width - currentImg.naturalWidth * ratio) / 2;
        const centerShift_y = (height - currentImg.naturalHeight * ratio) / 2;

        ctx.globalAlpha = 0.75;
        ctx.drawImage(
          currentImg,
          0,
          0,
          currentImg.naturalWidth,
          currentImg.naturalHeight,
          centerShift_x,
          centerShift_y,
          currentImg.naturalWidth * ratio,
          currentImg.naturalHeight * ratio
        );
        ctx.globalAlpha = 1.0;
      }

      // Draw connecting graph network edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw network nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.03;
        const currentRadius = node.radius + Math.sin(node.pulse) * 1.2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 opacity-75 ${className}`}
    />
  );
}
