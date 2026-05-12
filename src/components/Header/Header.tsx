'use client';

import type { FC } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link as ScrollLink } from 'react-scroll';
import { NAV_ITEMS, type NavItem } from '@/lib/nav-item';
import clsx from 'clsx';
import DarkMode from '../DarkMode/DarkMode';
import { useHeaderVisibility } from '@/components/HeaderVisibilityContext/HeaderVisibilityContext';
import MenuLang from '../MenuLang/MenuLang';
import { useTranslations } from 'next-intl';
import { Link as NextIntlLink } from '@/i18n/navigation';
import Image from 'next/image';

const MenuItemContent: FC<{ item: NavItem }> = ({ item }) => {
  const t = useTranslations('MenuBar');
  const title = t(item.id);

  const textStyles = clsx(
    'text-base font-normal text-icon-menu dark:text-tag-dark transition-all duration-300',
    'group-[.active]:font-semibold group-[.active]:text-dark-black group-[.active]:dark:text-white-pure'
  );
  return (
    <div className="relative py-2">
      <div className="flex flex-grow flex-col items-center justify-center gap-1">
        <span className={textStyles}>{title}</span>
      </div>
      <span className="group-[.active]:bg-main absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-transparent transition-all duration-400" />
    </div>
  );
};

const Header: FC = () => {
  const pathname = usePathname();
  const { isVisible, showAndUnlockHeader } = useHeaderVisibility();

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
              src="/images/matrix-logo.png" 
              width={100} 
              height={100} 
              alt='Matrix Logo' 
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
                      <ScrollLink
                        to={item.id}
                        spy={true}
                        smooth={true}
                        offset={-150}
                        duration={500}
                        activeClass="active"
                        className="group cursor-pointer"
                        onSetActive={showAndUnlockHeader}
                      >
                        <MenuItemContent item={item} />
                      </ScrollLink>
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
};

export default Header;
