"use client"
import { useState, useEffect } from 'react'
import IconsSocialMedia from '@/components/IconsSocialMedia/IconsSocialMedia';
import { Link } from '@/i18n/navigation';
import { GoArrowUpRight } from 'react-icons/go';

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { PanasonicRc6088Am } from '@/components/models/PanasonicRc6088Am'

type ContactSectionProps = {
  translations: {
    mainHeading: string;
    subHeading: string;
    description: string;
    ctaButton: string;
    emailAddress: string;
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

export default function ContactSection({ translations }: ContactSectionProps) {
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
  return (
    <section id="contact" className="bg-main px-5 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center py-15 text-center 2xl:py-64">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
        <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={5} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Environment preset="city" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Center top position={[0, -1.0, 0]}>
                <PanasonicRc6088Am scale={isMobile ? 4 : 7} />
              </Center>
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
        <h2 className="text-dark-black py-1 text-4xl font-semibold sm:text-6xl">
          {translations.mainHeading}
        </h2>
        <h2 className="text-dark-black py-1 text-4xl font-semibold sm:text-6xl">
          {translations.subHeading}
        </h2>
        <p className="text-dark-black mt-5 mb-10 text-xl font-normal">
          {translations.description}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`mailto:${translations.emailAddress}`}
            className="button-primary bg-white-pure dark:bg-dark-black flex items-center justify-center gap-2"
          >
            <span> {translations.ctaButton}</span>
            <GoArrowUpRight />
          </Link>
        </div>
        <div className="my-10">
          <IconsSocialMedia />
        </div>
      </div>
    </section>
  );
}
