/** Canonical origin for metadata, OG tags and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quicksellyourhouse.co.uk'
).replace(/\/$/, '');

/**
 * Brand and legal identity.
 *
 * Set NEXT_PUBLIC_BRAND_* to override without touching code. `legal` is only
 * rendered in the privacy policy — the trading name is what appears everywhere
 * else on the site.
 */
export const COMPANY = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Quick Sell Your House',
  /** Rendered as two-tone in the logo: `first` + accented `second`. */
  logo: { first: 'quicksell', second: 'yourhouse' },
  legal: process.env.NEXT_PUBLIC_BRAND_LEGAL || 'Land Invest 7 Limited',
  domain: publicDomain(),
};

/** The host, unless we're running locally — "localhost:3000" in a copyright
 *  line reads as a bug rather than as a dev environment. */
function publicDomain(): string {
  const host = new URL(SITE_URL).host.replace(/^www\./, '');
  return /^localhost|^127\.|^0\.0\.0\.0/.test(host) ? 'quicksellyourhouse.co.uk' : host;
}
