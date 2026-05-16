'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PiSunFill, PiMoonFill } from 'react-icons/pi';
import { IconType } from 'react-icons';
import { useHeaderVisibility } from '@/components/HeaderVisibilityContext/HeaderVisibilityContext';
import { useTranslations } from 'next-intl';

interface MenuDarkModeIcons {
  id: number;
  iconComponent: IconType;
  title: string;
  alt: string;
  theme: string;
}

export default function DarkMode() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl" />;
  }

  return <DarkModeContent />;
}

function DarkModeContent() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useHeaderVisibility();
  const t = useTranslations('DarkMode');

  const MenuDarkModeItems: MenuDarkModeIcons[] = [
    {
      id: 1,
      iconComponent: PiSunFill,
      title: t('light'),
      alt: 'Icon Light',
      theme: 'light',
    },
    {
      id: 2,
      iconComponent: PiMoonFill,
      title: t('dark'),
      alt: 'Icon Dark',
      theme: 'dark',
    },
  ];

  useEffect(() => {
    if (!isVisible) {
      setIsMenuOpen(false);
    }
  }, [isVisible]);

  const activeMode =
    MenuDarkModeItems.find((item) => item.theme === theme) ||
    MenuDarkModeItems[0];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleModeChange = (
    mode: MenuDarkModeIcons,
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (mode.theme === theme) return;
    if (event && 'key' in event && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    setTheme(mode.theme);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-100" ref={menuRef}>
      <button
        className="group bg-main dark:bg-main hover:bg-main active:text-white-matrix focus:bg-main flex cursor-pointer items-center justify-center rounded-xl p-2 transition-colors"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-label={t('ariaLabel')}
      >
        <activeMode.iconComponent className="text-white-matrix dark:text-white-matrix group-hover:text-white-matrix group-active:text-white-matrix group-focus:text-white-matrix h-6 w-6" />
      </button>
      {isMenuOpen && (
        <nav className="bg-white-matrix dark:bg-bg-gray absolute top-full right-0 z-50 mt-3 rounded-xl shadow-xl">
          <ul className="flex flex-col gap-2 p-2" role="menu">
            {MenuDarkModeItems.map((item) => {
              const IconComponent = item.iconComponent;
              const isSelected = theme === item.theme;
              return (
                <li
                  key={item.id}
                  className="hover:text-white-matrix focus:text-white-matrix dark:hover:text-white-matrix hover:bg-main focus:bg-main active:bg-main active:text-white-matrix text-black-matrix dark:text-white-matrix flex cursor-pointer items-center gap-4 rounded-xl px-2 py-3 transition-colors duration-150 focus:rounded-xl active:rounded-xl data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
                  onClick={(event) => handleModeChange(item, event)}
                  onKeyDown={(event) => handleModeChange(item, event)}
                  tabIndex={0}
                  role="menuitem"
                  aria-disabled={isSelected}
                  data-disabled={isSelected}
                >
                  <IconComponent
                    size={22}
                    className="dark:text-white-matrix shrink-0 2xl:h-10 2xl:w-10"
                  />
                  <span className="dark:text-white-matrix text-base font-normal">
                    {item.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
