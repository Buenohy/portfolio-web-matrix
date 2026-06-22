'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav-item';
import clsx from 'clsx';
import DarkMode from '../DarkMode/DarkMode';
import { useHeaderVisibility } from '@/components/HeaderVisibilityContext/HeaderVisibilityContext';
import MenuLang from '../MenuLang/MenuLang';
import { useTranslations } from 'next-intl';
import { Link as NextIntlLink } from '@/i18n/navigation';
import Image from 'next/image';
import MatrixLogo from '@/../public/images/matrix-logo.png';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const MenuItemContent: FC<{ item: NavItem }> = ({ item }) => {
  const t = useTranslations('MenuBar');
  const title = t(item.id);

  const textStyles = clsx(
    'text-base font-normal text-icon-menu dark:text-tag-dark transition-all duration-300',
    'group-[.active]:font-semibold group-[.active]:text-black-matrix group-[.active]:dark:text-white-matrix'
  );
  return (
    <div className="relative py-2">
      <div className="flex grow flex-col items-center justify-center gap-1">
        <span className={textStyles}>{title}</span>
      </div>
      <span className="group-[.active]:bg-main absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-transparent transition-all duration-400" />
    </div>
  );
};

export default function Header() {
  const pathname = usePathname();
  const { isVisible, showAndUnlockHeader } = useHeaderVisibility();

  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0,
      }
    );

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();

    setActiveSection(id);
    showAndUnlockHeader();

    // A MÁGICA ACONTECE AQUI:
    // Se o clique for no "Home", mandamos para o Y absoluto 0 (topo da página).
    // Se for outro, mandamos para o ID com um espaço de margem (80).
    const targetY = id === 'home' ? 0 : `#${id}`;
    const targetOffset = id === 'home' ? 0 : 80;

    gsap.to(window, {
      duration: 2.5, // Mantido 2.5 para dar tempo da animação fazer o "reverse" bonito
      scrollTo: {
        y: targetY,
        offsetY: targetOffset,
        autoKill: false,
      },
      ease: 'power3.inOut',
    });
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 z-40 flex w-full flex-col px-5 py-6 transition-transform duration-500 ease-in-out lg:px-10',
        { 'translate-y-0': isVisible, '-translate-y-full': !isVisible }
      )}
    >
      <div className="bg-white-pure dark:bg-dark-black border-gray-port dark:border-shadow-white-pure shadow-dark-black/2.5 dark:shadow-white-pure/2.5 mx-auto w-full max-w-7xl items-center rounded-xl border text-white shadow-xl">
        <div className="relative flex w-full items-center justify-between">
          <div className="flex items-center justify-start gap-2 p-2">
            <NextIntlLink href="/">
              <Image
                src={MatrixLogo}
                width={100}
                height={100}
                alt="Matrix Logo"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </NextIntlLink>
          </div>

          <nav className="hidden sm:block">
            <ul className="flex items-center gap-5">
              {NAV_ITEMS.map((item) => {
                const isOnCurrentPage = item.pageRoute === pathname;
                return (
                  <li key={item.id}>
                    {isOnCurrentPage ? (
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleNavClick(e, item.id)}
                        className={clsx('group cursor-pointer', {
                          active: activeSection === item.id,
                        })}
                      >
                        <MenuItemContent item={item} />
                      </a>
                    ) : (
                      <NextIntlLink
                        href={item.pageRoute}
                        className="group cursor-pointer"
                      >
                        <MenuItemContent item={item} />
                      </NextIntlLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-center gap-2 p-2">
            <DarkMode />
            <MenuLang />
          </div>
        </div>
      </div>
    </header>
  );
}
