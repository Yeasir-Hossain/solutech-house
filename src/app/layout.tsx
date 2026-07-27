import type { Metadata } from 'next';
import { Montserrat, Roboto } from 'next/font/google';
import { getSite } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import Reveals from '@/components/Reveals';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} — Sell Your House Fast For Cash`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      siteName: site.name,
      type: 'website',
      locale: 'en_GB',
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} ${roboto.variable}`}>
      <body className="wbah-has-hero">
        <Reveals />
        {children}
      </body>
    </html>
  );
}
