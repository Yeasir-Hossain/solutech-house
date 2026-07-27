import type { NextConfig } from 'next';

/**
 * 301 map carried over from the WordPress build (mu-plugins/wbah-core/redirects.php):
 * original indexed URLs whose slugs differ from ours. Keeping them preserves the
 * inbound link equity those pages already have.
 */
const legacyRedirects = [
  { source: '/terms-and-conditions', destination: '/website-terms' },
  { source: '/acceptable-use-policy', destination: '/site-acceptable-use-policy' },
  { source: '/sell-your-house-today', destination: '/get-a-valuation' },
  { source: '/sell-house-fast/birmingham-3', destination: '/sell-house-fast/birmingham' },
  { source: '/sell-house-fast/sell-house-fast-in-cardiff', destination: '/sell-house-fast/cardiff' },
  { source: '/sell-house-fast/sell-your-house-fast-in-london', destination: '/sell-house-fast/london' },
  { source: '/sell-house-fast/sell-your-house-fast-in-scotland', destination: '/sell-house-fast/scotland' },
  // Legacy landing page and review route that content still links to.
  { source: '/lp/sell-house-fast', destination: '/sell-house-fast' },
  { source: '/reviews', destination: '/success-stories' },
  /*
   * Targets that body copy still links to but which never had a page under
   * these paths. Each destination is the route that actually covers the
   * subject, so the link keeps its meaning instead of hitting a 404.
   */
  { source: '/reasons-to-sell/inheritance', destination: '/reasons-to-sell/selling-inherited-property' },
  { source: '/inheritance-tax-calculator', destination: '/blog/inheritance-tax-faqs' },
  { source: '/sell-your-house-now', destination: '/get-a-valuation' },
  { source: '/divorce/blog', destination: '/blog/category/divorce' },
  {
    source: '/divorce/blog/my-ex-was-paying-the-mortgage-and-wants-to-sell-what-are-my-options-105240',
    destination: '/blog/my-ex-was-paying-the-mortgage-and-wants-to-sell-149521',
  },
  // WordPress-era paths — nothing behind them any more.
  { source: '/wp-admin/:path*', destination: '/' },
  { source: '/wp-login.php', destination: '/' },
];

const nextConfig: NextConfig = {
  // The WordPress site served every URL with a trailing slash; keeping that
  // shape means no redirect hop for existing inbound links.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    // All imagery is local and already re-encoded to WebP at migration time.
    formats: ['image/webp'],
  },
  async redirects() {
    // trailingSlash: true means a destination without one costs a second hop,
    // so normalise here rather than letting Next re-redirect.
    return legacyRedirects.map((r) => ({
      ...r,
      destination: r.destination.endsWith('/') ? r.destination : `${r.destination}/`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Migrated media is content-addressed by name and never rewritten.
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
