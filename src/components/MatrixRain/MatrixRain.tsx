'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  color?: string; // Character color (default: Matrix green)
  fontSize?: number; // Font size (default: 14)
  speed?: number; // Animation speed (time in ms, default: 33ms)
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  color = '#00FF41',
  fontSize = 14,
  speed = 33,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas size to fit the entire window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Matrix-inspired characters (Japanese Katakana, alphabet, and numbers)
    const katakana = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = (katakana + latin + nums).split('');

    // Determine the number of columns based on screen width
    let columns = Math.floor(canvas.width / fontSize);
    let rainDrops: number[] = [];

    // Initialize the Y position for each column (all starting at the top)
    const initDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      rainDrops = [];
      for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
      }
    };

    initDrops();

    // Drawing function that runs repeatedly
    const draw = () => {
      // Create a trail effect by rendering a semi-transparent black background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        // Select a random character
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];

        // Draw the character
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;
        ctx.fillText(text, x, y);

        // Reset drop to the top after leaving the screen, with a slight random delay
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        // Move the drop down the screen
        rainDrops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, speed);

    // Cleanup when the component unmounts
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 block"
      style={{ background: '#000' }}
    />
  );
};
