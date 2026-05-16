'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { HackersBasement } from '@/components/models/HackersBasement'
import { Computer } from '@/components/models/Computer'
interface ServiceCardData {
  id: string;
  iconHeader: string;
  title: string;
  description: string;
  badges: string[];
  iconFooter: string;
}

type ServicesSectionProps = {
  translations: {
    sectionTitle: string;
    mainHeading: React.ReactNode;
    subHeading: React.ReactNode;
    cards: ServiceCardData[];
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

export default function ServicesSection({
  translations,
}: ServicesSectionProps) {
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
    <section className="flex flex-col gap-10 px-5 pb-30 lg:px-10" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="lg:flex lg:self-start">
          <div className="h-[300px] w-full">
            <Canvas camera={{ position: [5, 0, 10], fov: 35 }}>
              <OrbitControls enableZoom={false} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
              <pointLight position={[-10, -10, -10]} intensity={1} />
              
              <Environment preset="city" />
  
            <Suspense fallback={null}>
              <Center top position={[0, isMobile ? -2.0 : -2.0, 0]}>
                <Computer scale={isMobile ? 8 : 8} />
              </Center>
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
          <div>
            <h2 className="text-dark-black dark:text-white-pure my-1 text-xl font-bold uppercase sm:text-2xl lg:mb-4">
              {translations.sectionTitle}
            </h2>
            <h3 className="text-dark-black dark:text-white-pure mt-1 mb-10 text-xl sm:text-5xl">
              {translations.mainHeading}
            </h3>
            <p className="text-dark-black dark:text-white-pure my-4 text-left font-light">
              {translations.subHeading}
            </p>
          </div>
        </div>

        {/* <ul className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {translations.cards.map(
            ({ id, iconHeader, title, description, badges, iconFooter }) => (
              <li key={id} className="flex">
                <article className="flex w-full flex-col">
                  <Card className="shadow-dark-black/30 dark:shadow-white-pure/30 flex h-full flex-col rounded-xl bg-gradient-to-b from-[#0c1c251a]/200 via-white to-white shadow-xl dark:border-[#fbfbff1a] dark:bg-gradient-to-b dark:from-[#29292b] dark:via-[#0c1c251a] dark:to-[#0c1c251a]">
                    <CardContent className="flex flex-1 flex-col items-center p-6">
                      <CardHeader className="text-dark-black dark:text-white-pure flex items-center justify-center p-0 pb-4">
                        <Icon icon={iconHeader} className="h-30 w-30" />
                      </CardHeader>

                      <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <CardTitle className="text-dark-black dark:text-white-pure text-3xl">
                          {title}
                        </CardTitle>
                        <CardDescription className="text-dark-black dark:text-white-pure my-4 text-base font-light">
                          {description}
                        </CardDescription>
                        <div className="flex flex-wrap justify-center gap-2">
                          {badges.map((badge, idx) => (
                            <Badge
                              key={idx}
                              className="text-white-pure bg-dark-black dark:text-dark-black dark:bg-white-pure py-1 text-xs uppercase"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <CardFooter className="text-dark-black dark:text-white-pure mt-4 flex items-center justify-center p-0">
                        <Icon icon={iconFooter} className="h-30 w-30" />
                      </CardFooter>
                    </CardContent>
                  </Card>
                </article>
              </li>
            )
          )}
        </ul> */}
    </div>
    </section>
  );
}
