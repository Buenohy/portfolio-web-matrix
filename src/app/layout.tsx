import './globals.css';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { setRequestLocale } from 'next-intl/server';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.variable} selection:bg-green-terminal`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
