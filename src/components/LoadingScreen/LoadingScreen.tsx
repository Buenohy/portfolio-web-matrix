'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface LoadingScreenProps {
  progress: number; // Porcentagem vinda do useProgress
  active: boolean; // Indica se o carregamento está ativo
  onFinished: () => void; // Callback disparado ao sumir a tela
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  active,
  onFinished,
}) => {
  const t = useTranslations('LoadingScreen');
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [smoothedProgress, setSmoothedProgress] = useState(0);

  // Garante que o valor bruto recebido esteja sempre limitado entre 0 e 100
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  const progressRef = useRef(clampedProgress);

  useEffect(() => {
    // Se o ThreeJS terminou de carregar (active === false), força o progresso para 100
    if (!active) {
      progressRef.current = 100;
    } else {
      progressRef.current = clampedProgress;
    }
  }, [clampedProgress, active]);

  // Fail-safe: Fecha a tela de carregamento após 12 segundos caso ocorra algum travamento
  useEffect(() => {
    const failSafeTimeout = setTimeout(() => {
      setSmoothedProgress(100);
      setFadeOut(true);
    }, 12000); // 12 segundos de limite máximo

    return () => clearTimeout(failSafeTimeout);
  }, []);

  // Loop de animação contínuo para atualizar a barra de progresso de forma suave
  useEffect(() => {
    let animationFrameId: number;

    const smoothIncrement = () => {
      setSmoothedProgress((prev) => {
        const target = progressRef.current;
        if (prev < target) {
          const step = 1.0; // Velocidade do incremento por frame
          return Math.min(prev + step, target);
        }
        return prev;
      });

      animationFrameId = requestAnimationFrame(smoothIncrement);
    };

    animationFrameId = requestAnimationFrame(smoothIncrement);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Dispara o fadeOut quando o progresso visual suave atinge 100%
  useEffect(() => {
    if (smoothedProgress >= 100) {
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [smoothedProgress]);

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
        {/* Texto do terminal */}
        <h2 className="mb-4 font-mono text-sm tracking-widest text-[#00FF41]">
          {t('systemLoading')}... {Math.round(smoothedProgress)}%
        </h2>

        {/* Barra de Progresso */}
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-[#00FF41]/20 bg-neutral-900">
          <div
            className="h-full bg-[#00FF41] shadow-[0_0_10px_#00FF41]"
            style={{ width: `${smoothedProgress}%` }}
          />
        </div>

        {/* Legenda */}
        <p className="mt-2 font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
          {t('resources')}
        </p>
      </div>
    </div>
  );
};
