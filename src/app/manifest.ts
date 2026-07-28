import type { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/site';

/** Install metadata. `icon.svg`, `favicon.ico` and `apple-icon.png` sit next to
 *  this file and are picked up by Next's file conventions on their own. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.name} — Sell Your House Fast For Cash`,
    short_name: COMPANY.name,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#20a997',
    icons: [
      { src: '/img/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/img/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/img/logo-mark.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
