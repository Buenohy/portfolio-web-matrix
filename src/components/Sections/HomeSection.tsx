"use client"

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { NeoShades } from '@/components/NeoShades'
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type HomeSectionProps = {
  translations: {
    greeting: string;
    mainTitle: React.ReactNode;
    cvButton: string;
    avatarAriaLabel: string;
    avatarAlt: string;
  };
};

// Lógica de seguir o mouse
function MouseFollower({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const x = state.pointer.x
    const y = state.pointer.y
    // Rotação suave e limitada para não "quebrar" o modelo
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      x * (Math.PI / 10),
      0.5
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -y * (Math.PI / 10),
      0.5
    )
  })

  return <group ref={group}>{children}</group>
}


export default function HomeSection({ translations }: HomeSectionProps) {
  const container = useRef<HTMLDivElement>(null)

  // ANIMAÇÃO GSAP
  useGSAP(() => {
    // repeat: -1 faz o loop ser infinito
    // repeatDelay: 5 faz a animação esperar 5 segundos antes de começar de novo
    const tl = gsap.timeline({ 
      repeat: -1, 
      repeatDelay: 2,
      defaults: { ease: "power4.out" } 
    });

    // 1. Animação de ENTRADA
    tl.fromTo(".animate-text", 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.2 }
    )
    
    tl.fromTo(".animate-button",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=1"
    )

    // 2. Animação de SAÍDA (Opcional - para o texto sumir antes de repetir)
    // Se você não colocar isso, o texto vai "piscar" e voltar para baixo do nada
    tl.to(".animate-text, .animate-button", {
      opacity: 0,
      y: -20, // Sobe um pouquinho enquanto some
      duration: 1,
      delay: 3 // Tempo que o texto fica visível antes de sumir para o próximo ciclo
    })

  }, { scope: container })

  return (
    <section
      ref={container}
      id="home"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <MouseFollower>
                <Center top position={[0, -4.0, 0]}>
                  <NeoShades scale={1} />
                </Center>
              </MouseFollower>
            </Float>
            
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2} 
              far={4.5} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. LAYER DE CONTEÚDO (TEXTOS) */}
      {/* pointer-events-none permite que o mouse "atravesse" o texto e mova o 3D */}
      <div className="pointer-events-none relative z-10 flex h-full w-full max-w-7xl flex-col justify-between px-6 py-20 md:px-12">
        
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row md:items-center mt-50">
          {/* LADO ESQUERDO (Greeting) */}
          <div className="max-w-md animate-text">
            <h1 className="text-xl font-light text-green-terminal md:text-xl tracking-tighter">
              {/* {translations.greeting} */}
              Hello! I'm
            </h1>
            <h1 className="text-xl font-bold text-white-matrix md:text-4xl uppercase tracking-tighter">
              GABRIEL <br/> BUENO
            </h1>
          </div>

          {/* LADO DIREITO (Main Title) */}
          <div className="max-w-xl md:text-left animate-text">
            <h2 className="text-xl leading-tight text-green-terminal md:text-xl font-light">
              {/* {translations.mainTitle} */}
              A Full Stack
            </h2>
            <h2 className="text-4xl font-bold leading-tight text-white md:text-4xl uppercase">
              Software
            </h2>
            <h2 className="text-4xl font-bold leading-tight text-white md:text-4xl uppercase">
              Engineer
            </h2>
          </div>
        </div>

        {/* <div className="pointer-events-auto flex w-full justify-center md:justify-start">
          <DownloadCVButton text={translations.cvButton} />
        </div> */}
      </div>
    </section>
  );
}