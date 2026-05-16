import Link from 'next/link';

import { useTranslations } from 'next-intl';

import Image from 'next/image';
import MatrixLogo from '@/../public/images/matrix-logo.png'

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="dark:bg-black-matrix mb-20 bg-transparent px-5 text-center md:mb-0 lg:px-10">
      <div className="flex max-w-7xl flex-col items-center gap-4 py-10 md:flex md:flex-row md:justify-between">
        <p className="text-black-matrix my-3 flex items-center justify-evenly gap-2 text-xs font-light md:flex md:gap-1 dark:text-white-matrix">
          <Image 
          src={MatrixLogo}
          width={85} 
          height={85} 
          alt='Matrix Logo' 
          />
          {t('createdBy')}
          <Link href="#about" className="text-main text-xs font-bold">
            {t('nameCreator')}
          </Link>
        </p>
        <p className="text-black-matrix dark:text-white-matrix my-3 text-xs font-light">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
