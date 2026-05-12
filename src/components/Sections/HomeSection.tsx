"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/navigation';
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton';
import { Canvas } from '@react-three/fiber'

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
            <div className='w-50 h-50'>
              <Canvas className='bg-green-terminal'>
                <mesh>
                  <sphereGeometry />
                  <meshBasicMaterial />
                </mesh>
              </Canvas>
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
