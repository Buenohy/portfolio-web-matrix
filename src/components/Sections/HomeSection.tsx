"use client"

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Model } from '@/components/Neo_shades'
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton'

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

const GsapFromTo = () => {
  useGSAP(() => {
    GsapFromTo.
  })
}

export default function HomeSection({ translations }: HomeSectionProps) {
  return (
    <section
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
                  <Model scale={1} />
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
          <div className="max-w-md">
            <h1 className="text-xl font-light text-green-terminal md:text-xl uppercase tracking-tighter">
              {/* {translations.greeting} */}
              Hello! I'm
            </h1>
            <h1 className="text-xl font-light text-green-terminal md:text-4xl uppercase tracking-tighter">
              GABRIEL <br/> BUENO
            </h1>
            {/* Espaço para o nome caso queira adicionar, ou o greeting já basta */}
          </div>

          {/* LADO DIREITO (Main Title) */}
          <div className="max-w-xl md:text-right">
            <h2 className="text-4xl font-bold leading-tight text-white md:text-4xl">
              {/* {translations.mainTitle} */}
              A Full Stack
            </h2>
            <h2 className="text-4xl font-bold leading-tight text-white md:text-4xl">
              Engineer
            </h2>
          </div>
        </div>

        {/* BOTÃO NO RODAPÉ CENTRALIZADO */}
        {/* <div className="pointer-events-auto flex w-full justify-center md:justify-start">
          <DownloadCVButton text={translations.cvButton} />
        </div> */}
      </div>
    </section>
  );
}