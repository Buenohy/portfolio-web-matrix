import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { HeaderVisibilityProvider } from '@/components/HeaderVisibilityContext/HeaderVisibilityContext';
import Header from '@/components/Header/Header';
import MenuBar from '@/components/MenuBar/MenuBar';
import Footer from '@/components/Footer/Footer';

import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { AppTransitionProvider } from '@/components/AppTransitionProvider/AppTransitionProvider';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <HeaderVisibilityProvider>
        {/* 
          Placed inside NextIntlClientProvider so the loading screen 
          can correctly fetch translation keys.
        */}
        <AppTransitionProvider>
          <Header />
          <main>{children}</main>
          <MenuBar />
          <Footer />
        </AppTransitionProvider>
      </HeaderVisibilityProvider>
    </NextIntlClientProvider>
  );
}
