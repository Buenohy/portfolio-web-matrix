"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/navigation';
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton';

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/fiber'
import { Model } from '@/components/Neo_shades'
import { Suspense } from 'react'

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
  return (
    <section
      id="home"
      className="flex items-center justify-center scroll-smooth px-5 pt-20 pb-30 md:px-10"
    >
      <div className="mx-auto mt-10 flex w-fit flex-col">
        <div className="lg:flex lg:gap-8">
          <div>
            <div className="flex justify-start py-5">
              {/* <Link href="#about" aria-label={translations.avatarAriaLabel}>
                <Avatar className="md:min-h-10 md:min-w-10">
                  <AvatarImage
                    src="/images/foto-perfil.jpg"
                    alt={translations.avatarAlt}
                  />
                  <AvatarFallback>GB</AvatarFallback>
                </Avatar>
              </Link> */}
            </div>
            <h1 className="dark:text-white-pure text-dark-black mb-8 py-1 text-xl font-light md:text-2xl lg:text-2xl">
              {translations.greeting}
            </h1>
            <div className='w-full h-[400px] md:w-[500px] md:h-[500px] cursor-grab active:cursor-grabbing'>
              <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                {/* 1. Iluminação (Obrigatório) */}
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                
                {/* 2. O Modelo dentro de um Suspense (para carregar) */}
                <Suspense fallback={null}>
                    {/* Ajustei a escala e posição para o modelo centralizar */}
                    <Model scale={0.5} position={[0, -1, 0]} />
                    
                    {/* Reflexos bonitos nos óculos */}
                    <Environment preset="city" /> 
                    
                    {/* Sombra suave no chão */}
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                </Suspense>

                {/* 3. Controles para girar com o mouse */}
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </div>
          </div>
          <div className="lg:flex lg:flex-col">
            <h2 className="text-dark-black dark:text-white-pure text-2xl font-bold md:text-7xl lg:text-7xl">
              {translations.mainTitle}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <DownloadCVButton text={translations.cvButton} />
        </div>
      </div>
    </section>
  );
}
