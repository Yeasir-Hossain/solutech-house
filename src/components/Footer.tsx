import Link from 'next/link';
import { getMenu, getSite } from '@/lib/content';
import { COMPANY } from '@/lib/site';

function FooterMenu({ location }: { location: string }) {
  const items = getMenu(location);
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="menu-item">
          <Link href={item.path}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wbah-container">
        <div className="footer-cols">
          <div className="footer-col footer-col--brand">
            <div className="site-branding">
              Solutech <span className="accent">House</span>
            </div>
            <p className="footer-copy">
              Copyright {year}. All rights reserved. {COMPANY.domain}, trading style of{' '}
              {COMPANY.legal}, company registered number {COMPANY.companyNumber}.
            </p>
            <Link className="wbah-btn wbah-btn--cta" href="/get-a-valuation/">
              Make me an offer
            </Link>
          </div>

          <div className="footer-col">
            <h4>Reasons To Sell</h4>
            <FooterMenu location="footer-reasons" />
          </div>

          <div className="footer-col">
            <h4>About Us</h4>
            <FooterMenu location="footer-company" />
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <FooterMenu location="footer-quick" />
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>{site.name}</span>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/website-terms/">Terms</Link>
            <Link href="/privacy-policy/">Privacy</Link>
            <Link href="/cookie-policy/">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
