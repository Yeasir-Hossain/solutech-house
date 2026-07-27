import Link from 'next/link';
import SiteShell from '@/components/SiteShell';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="wbah-page-hero has-image" style={{ ['--hero-img' as string]: "url('/img/city.avif')" }}>
        <div className="wbah-page-hero__overlay" />
        <div className="wbah-container">
          <h1 className="wbah-page-hero__title">Page not found</h1>
          <p className="wbah-page-hero__sub">
            The page you were looking for isn’t here. Try the homepage, or get a free cash offer.
          </p>
        </div>
      </section>

      <section className="wbah-section">
        <div className="wbah-container" style={{ textAlign: 'center' }}>
          <p>
            <Link className="wbah-btn wbah-btn--primary" href="/">
              Back to home
            </Link>{' '}
            <Link className="wbah-btn wbah-btn--ghost-dark" href="/get-a-valuation/">
              Get a valuation
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
