'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  fontSize?: number; // Font size (default: 14)
  speed?: number; // Animation speed (time in ms, default: 33ms)
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize = 14,
  speed = 33,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Defer mounting to avoid SSR hydration mismatches
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper to check if dark mode is active on the document
    const checkIsDark = () =>
      document.documentElement.classList.contains('dark');

    // Helper to clear and repaint canvas with a solid color on theme switch or resize
    const clearCanvasBuffer = () => {
      ctx.fillStyle = checkIsDark() ? '#000000' : '#e6ffe6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clearCanvasBuffer();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Clear buffer initially
    clearCanvasBuffer();

    // MutationObserver to listen for Tailwind's dark class changes on the <html> element
    const observer = new MutationObserver(() => {
      clearCanvasBuffer();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const katakana = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = (katakana + latin + nums).split('');

    let columns = Math.floor(canvas.width / fontSize);
    let rainDrops: number[] = [];

    const initDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      rainDrops = [];
      for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
      }
    };

    initDrops();

    const draw = () => {
      // Dynamic evaluation inside the frame loop to match Tailwind's state
      const isDarkActive = checkIsDark();
      const currentFadeColor = isDarkActive
        ? 'rgba(0, 0, 0, 0.05)'
        : 'rgba(230, 255, 230, 0.05)';
      const currentTextColor = isDarkActive ? '#00FF41' : '#008f11';

      ctx.fillStyle = currentFadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = currentTextColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, speed);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted, fontSize, speed]);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-black" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="bg-white-matrix pointer-events-none fixed inset-0 -z-10 block transition-colors duration-500 dark:bg-black"
    />
  );
};
