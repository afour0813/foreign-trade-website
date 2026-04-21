import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n';
import { LocaleSync } from '@/components/LocaleSync';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AnnaHairBows - Children\'s Hair Accessories Manufacturer',
    template: '%s | AnnaHairBows',
  },
  description:
    'Professional manufacturer of high quality children\'s hair accessories including hair clips, headbands, hair bows, ponytail holders and more. Wholesale and custom orders welcome.',
  keywords: [
    'children hair accessories',
    'hair clips',
    'headbands',
    'hair bows',
    'baby accessories',
    'wholesale hair accessories',
  ],
  authors: [{ name: 'AnnaHairBows' }],
  openGraph: {
    title: 'AnnaHairBows - Children\'s Hair Accessories Manufacturer',
    description: 'Professional manufacturer of high quality children\'s hair accessories',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <I18nProvider>
          <LocaleSync />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
