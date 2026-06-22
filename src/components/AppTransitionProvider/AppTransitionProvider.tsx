'use client';

import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';

interface AppTransitionProviderProps {
  children: React.ReactNode;
}

export function AppTransitionProvider({
  children,
}: AppTransitionProviderProps) {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Wait for the 1000ms CSS scale transition to finish
      const timer = setTimeout(() => {
        setAnimationCompleted(true); // Strip transform classes to fix GSAP fixed positioning

        if (typeof window !== 'undefined') {
          (window as any).__APP_READY__ = true; // Set global flag
          window.dispatchEvent(new Event('app-ready')); // Notify components
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <>
      <LoadingScreen progress={progress} onFinished={() => setIsReady(true)} />

      <div
        className={`relative z-10 min-h-screen ${
          animationCompleted
            ? '' // Once completed, remove scale/transition classes entirely so GSAP pins correctly
            : `transition-all duration-1000 ease-out ${
                isReady
                  ? 'scale-100 opacity-100 blur-none'
                  : 'scale-95 opacity-0 blur-sm'
              }`
        }`}
      >
        {children}
      </div>
    </>
  );
}
