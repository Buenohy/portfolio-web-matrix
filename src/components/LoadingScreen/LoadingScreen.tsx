'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface LoadingScreenProps {
  progress: number; // Actual assets loading percentage (from 0 to 100)
  onFinished: () => void; // Callback triggered when the exit transition ends
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  onFinished,
}) => {
  const t = useTranslations('LoadingScreen');
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [smoothedProgress, setSmoothedProgress] = useState(0);

  // Keep track of the latest progress in a mutable ref to avoid restarting the animation loop
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Continuous animation loop running at 60fps
  useEffect(() => {
    let animationFrameId: number;

    const smoothIncrement = () => {
      setSmoothedProgress((prev) => {
        const target = progressRef.current;
        if (prev < target) {
          // Fixed increment per frame.
          // 1.0 means it rises steadily by 1% per frame, taking exactly 1.6s to crawl to 100% when cached.
          const step = 1.0;
          return Math.min(prev + step, target);
        }
        return prev;
      });

      animationFrameId = requestAnimationFrame(smoothIncrement);
    };

    animationFrameId = requestAnimationFrame(smoothIncrement);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Empty dependency array ensures the animation loop runs uninterrupted

  // Trigger fadeOut only when the visual smoothed progress reaches 100%
  useEffect(() => {
    if (smoothedProgress >= 100) {
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [smoothedProgress]);

  // Remove the loader from the DOM once the transition ends
  const handleTransitionEnd = () => {
    if (fadeOut) {
      setShouldRender(false);
      onFinished();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
        fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-64 text-center">
        {/* Terminal/Matrix styled text */}
        <h2 className="mb-4 font-mono text-sm tracking-widest text-[#00FF41]">
          {t('systemLoading')}... {Math.round(smoothedProgress)}%
        </h2>

        {/* Progress Bar Container */}
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-[#00FF41]/20 bg-neutral-900">
          <div
            className="h-full bg-[#00FF41] shadow-[0_0_10px_#00FF41]" // 'transition' stripped to allow frame-by-frame JS rendering
            style={{ width: `${smoothedProgress}%` }}
          />
        </div>

        {/* Localized loading subtitle */}
        <p className="mt-2 font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
          {t('resources')}
        </p>
      </div>
    </div>
  );
};
