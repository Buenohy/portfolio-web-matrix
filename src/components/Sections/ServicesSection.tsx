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

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { Computer } from '@/components/models/Computer';

type ServicesSectionProps = {
  translations: {
    sectionTitle: string;
    mainHeading: React.ReactNode;
    subHeading: React.ReactNode;
    cards: ServiceCardData[];
  };
};

export default function ServicesSection({
  translations,
}: ServicesSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="flex flex-col gap-10 px-5 pb-30 lg:px-10" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="lg:flex lg:self-start">
          <div className="relative flex h-[100px] w-fit items-center justify-center md:h-[200px] lg:h-[300px]">
            <Canvas camera={{ position: [5, 0, 10], fov: 35 }}>
              <OrbitControls enableZoom={false} />
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={2}
              />
              <pointLight position={[-10, -10, -10]} intensity={1} />

              <Environment preset="city" />

              <Suspense fallback={null}>
                <Center
                  top
                  position={[0, isMobile ? -2.0 : -2.0, 0]}
                  rotation={[0, THREE.MathUtils.degToRad(-35), 0]}
                >
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
      </div>
    </section>
  );
}
