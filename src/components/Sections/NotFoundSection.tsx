"use client"

import Link from 'next/link';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { MetalSpoon } from '@/components/models/MetalSpoon';

type NotFoundClientProps = {
  translations: {
    title: string;
    subTitle: string;
    description: string;
    buttonHomePage: string;
  };
};

export default function NotFoundClient({ translations }: NotFoundClientProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="animate-shake my-4 text-6xl font-semibold text-black dark:text-white">
        {translations.title}
      </h1>
      <h2 className="my-1 text-xl font-normal text-black dark:text-white">
        {translations.subTitle}
      </h2>
      <p className="my-5 text-base font-light text-[#0c1c2599] dark:text-[#fbfbff99]">
        {translations.description}
      </p>

      <div className="h-[400px] w-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={10} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Center top position={[0, -3.0, 0]}>
              <MetalSpoon scale={30} />
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

      <Link href="/" className="button-primary mx-auto my-10 inline-block">
        {translations.buttonHomePage}
      </Link>
    </section>
  );
}