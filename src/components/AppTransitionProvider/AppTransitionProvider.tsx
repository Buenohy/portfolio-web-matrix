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
  // Extraímos "progress" para a barra e "active" para saber se ainda está carregando
  const { progress, active } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Aguarda a transição de CSS de 1000ms finalizar
      const timer = setTimeout(() => {
        setAnimationCompleted(true); // Remove classes de escala para evitar bugs com GSAP

        if (typeof window !== 'undefined') {
          (window as any).__APP_READY__ = true; // Define flag global
          window.dispatchEvent(new Event('app-ready')); // Notifica outros componentes
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <>
      <LoadingScreen
        progress={progress}
        active={active}
        onFinished={() => setIsReady(true)}
      />

      <div
        className={`relative z-10 min-h-screen ${
          animationCompleted
            ? ''
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
