"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { GoArrowUpRight } from 'react-icons/go';

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { NeoShades } from '@/components/models/NeoShades'

type AboutSectionProps = {
  translations: {
    sectionTitle: string;
    mainHeading: string;
    paragraph1: React.ReactNode;
    paragraph2: React.ReactNode;
    paragraph3: React.ReactNode;
    contactButton: string;
    linkedinButton: string;
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

export default function AboutSection({ translations }: AboutSectionProps) {
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
    <section className="px-5 lg:px-10" id="about">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-dark-black dark:text-white-pure text-xl md:text-2xl">
            {translations.sectionTitle}
          </h2>
          <h3 className="text-dark-black dark:text-white-pure text-4xl font-bold md:text-4xl">
            {translations.mainHeading}
          </h3>
        </div>

        <div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-center">
          {/* <Image
            src="/images/foto-perfil.jpg"
            alt="Foto de perfil de Gabriel Bueno"
            width={484}
            height={484}
            className="mx-auto my-5 max-h-[464px] w-full max-w-[464px] rounded-2xl object-cover"
          /> */}
          <div className="relative h-[350px] md:h-[500px] w-full">
          <Canvas camera={{ position: [-5, 0, 10], fov: 35 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            
            <Environment preset="city" />
  
            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <MouseFollower>
                  <Center top position={[0, isMobile ? -1.5 : -3.0, 0]}>
                    <NeoShades scale={isMobile ? 0.6 : 1} />
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
          <div className="my-6 space-y-6 lg:mx-auto lg:max-w-3xl">
            <p className="text-dark-black dark:text-white-pure text-center lg:text-left lg:leading-7">
              {translations.paragraph1}
            </p>
            <p className="text-dark-black dark:text-white-pure text-center lg:text-left lg:leading-7">
              {translations.paragraph2}
            </p>
            <p className="text-dark-black dark:text-white-pure text-center lg:text-left lg:leading-7">
              {translations.paragraph3}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 py-10 text-center lg:mx-auto lg:flex-row lg:justify-center">
          <Link href="#contact" className="button-primary">
            <span>{translations.contactButton}</span>
          </Link>
          <a
            href="https://www.linkedin.com/in/gabriel-bueno-hygino"
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary button-outline flex items-center justify-center gap-2"
          >
            <span>{translations.linkedinButton}</span>
            <GoArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
