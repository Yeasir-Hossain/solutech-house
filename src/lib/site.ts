/** Canonical origin for metadata, OG tags and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solutechhouse.co.uk'
).replace(/\/$/, '');

/**
 * Brand and legal identity.
 *
 * The trading name is provisional — set NEXT_PUBLIC_BRAND_* to override without
 * touching code. The registered-company details are carried over from the site
 * this content came from and must be confirmed before going live.
 */
export const COMPANY = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Solutech House',
  /** Rendered as two-tone in the logo: `first` + accented `second`. */
  logo: { first: 'solutech', second: 'house' },
  legal: process.env.NEXT_PUBLIC_BRAND_LEGAL || 'Solutech Holdings Limited',
  companyNumber: process.env.NEXT_PUBLIC_BRAND_COMPANY_NO || '12345678',
  domain: publicDomain(),
};

/** The host, unless we're running locally — "localhost:3000" in a copyright
 *  line reads as a bug rather than as a dev environment. */
function publicDomain(): string {
  const host = new URL(SITE_URL).host.replace(/^www\./, '');
  return /^localhost|^127\.|^0\.0\.0\.0/.test(host) ? 'solutechhouse.co.uk' : host;
}
