"use client"

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { WhiteRoom } from '@/components/models/WhiteRoom'
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registra o plugin do GSAP
gsap.registerPlugin(ScrollTrigger)

type HomeSectionProps = {
  translations: {
    greeting: string;
    mainTitle: React.ReactNode; 
    cvButton: string;
    avatarAriaLabel: string;
    avatarAlt: string;
  };
};

export default function HomeSection({ translations }: HomeSectionProps) {
  // 1. Cria o estado (começamos assumindo que não é mobile, ou seja, scale 2.5)
  const [isMobile, setIsMobile] = useState(false)

  // 2. Cria o ouvinte de tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      // Se a tela for menor que 768px (padrão 'md' do Tailwind), isMobile vira true
      setIsMobile(window.innerWidth < 768)
    }

    // Chama uma vez na montagem para pegar o tamanho inicial
    handleResize()

    // Adiciona o listener para caso o usuário gire o celular ou redimensione a janela
    window.addEventListener('resize', handleResize)
    
    // Limpa o listener quando o componente for destruído
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Refs do GSAP e da Cena
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Group>(null!)
  
  // Ref Pai (Camada da UI) - Usado no ScrollTrigger
  const uiLayerRef = useRef<HTMLDivElement>(null)
  
  // Refs Filhos - Usados na animação de Entrada
  const textLeftRef = useRef<HTMLDivElement>(null)
  const textRightRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  
  // Estado para garantir que o GSAP só inicie após o modelo 3D carregar
  const [isLoaded, setIsLoaded] = useState(false)

  useGSAP(() => {
    // --- 1. ANIMAÇÃO DE ENTRADA (Aparece ao carregar a página) ---
    // Anima os elementos filhos individualmente
    const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    introTl.fromTo([textLeftRef.current, textRightRef.current], 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, delay: 0.5 }
    );

    introTl.fromTo(buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 },
      "-=1"
    );

    // --- 2. ANIMAÇÃO DE SCROLL (Giro e Mergulho na TV) ---
    // Só cria esta timeline se o modelo 3D (sceneRef) estiver pronto
    if (isLoaded && sceneRef.current) {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%", // Deixa a animação mais longa e suave
          scrub: 3,      // Aumenta o "peso/inércia" da transição
          pin: true,     // Trava a seção na tela
        }
      });

      scrollTl
        // 1. Rotação: De costas (Math.PI) para frente (0)
        .fromTo(sceneRef.current.rotation, 
          { y: Math.PI }, 
          { y: 0, ease: "none" }
        )
        // 2. Some com TODOS os textos e botão animando apenas a div "Pai"
        .to(uiLayerRef.current, {
          opacity: 0,
          y: -150,
          ease: "none"
        }, 0)
        // 3. Mergulho: Aumenta o Z para "atravessar" a câmera
        .to(sceneRef.current.position, {
          z: 28,     // Valor para atravessar a tela totalmente
          y: isMobile ? 1 : 0,      // Alinhamento do centro da TV com a câmera
          ease: "power2.in"
        }, ">") 
        // 4. Escurece a tela no final do mergulho para transição
        .to(".overlay-black", { opacity: 1, duration: 0.1 });

      // Atualiza o ScrollTrigger para garantir os cálculos corretos de altura
      ScrollTrigger.refresh();
    }
  }, { dependencies: [isLoaded], scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full max-w-full overflow-hidden"
    >
      {/* Camada de transição preta no final da animação */}
      <div className="overlay-black pointer-events-none absolute inset-0 z-20 opacity-0" />

      {/* 1. LAYER 3D (Fundo) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          
          <Environment preset="city" />

          <Suspense fallback={null}>
            {/* O grupo sceneRef começa com rotação de 180 graus (costas) */}
            <group ref={sceneRef} rotation={[0, Math.PI, 0]}>
              <Center top position={[0, isMobile ? -1 : -2.0, 0]}>
                <WhiteRoom scale={isMobile ? 1 : 2.5} />
              </Center>
            </group>
            
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.4} 
              scale={15} 
              blur={2} 
              far={4.5} 
            />

            {/* Helper para avisar quando o Suspense terminar */}
            <SceneInit onReady={() => setIsLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. LAYER DE INTERFACE (Textos) - Adicionado a ref do Pai (uiLayerRef) */}
      <div 
        ref={uiLayerRef}
        className="pointer-events-none relative z-10 flex h-full w-full max-w-7xl flex-col justify-between px-6 py-20 md:px-12 mx-auto"
      >
        
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row md:items-center mt-32">
          {/* LADO ESQUERDO */}
          <div ref={textLeftRef} className="max-w-md opacity-0">
            <h1 className="text-xl font-light text-green-500 tracking-tighter">
              {translations.greeting || "Hello! I'm"}
            </h1>
            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter md:text-6xl">
              GABRIEL <br/> BUENO
            </h1>
          </div>

          {/* LADO DIREITO */}
          <div ref={textRightRef} className="max-w-xl text-left md:text-right opacity-0">
            <h2 className="text-xl leading-tight text-green-500 font-light">
              A Full Stack
            </h2>
            <h2 className="text-4xl font-bold leading-tight text-white uppercase md:text-6xl">
              Software <br/> Engineer
            </h2>
          </div>
        </div>

        {/* BOTÃO (Centralizado ou Alinhado) */}
        <div ref={buttonRef} className="pointer-events-auto flex w-full justify-center md:justify-start opacity-0">
          <DownloadCVButton text={translations.cvButton} />
        </div>
      </div>
    </section>
  );
}

/**
 * Pequeno componente helper para detectar quando o modelo 3D 
 * dentro do Suspense foi montado, evitando que o GSAP trave.
 */
function SceneInit({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}