'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MenuNode } from '@/lib/types';
import { COMPANY } from '@/lib/site';

/**
 * Fixed header: transparent over a page's hero, solid once scrolled.
 * On mobile the nav becomes a slide-in drawer with tap-to-expand submenus.
 */
export default function Header({ menu }: { menu: MenuNode[] }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer when a link navigates.
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('wbah-nav-open', open);
    return () => document.body.classList.remove('wbah-nav-open');
  }, [open]);

  return (
    <>
      <a className="skip-link screen-reader-text" href="#main">
        Skip to content
      </a>

      <header className={`site-header${solid ? ' is-solid' : ''}`} id="site-header">
        <div className="wbah-container site-header__inner">
          <div className="site-branding">
            <Link href="/" className="site-logo">
              <span className="site-logo__mark" aria-hidden="true" />
              {COMPANY.logo.first}
              <span className="accent">{COMPANY.logo.second}</span>
            </Link>
          </div>

          <nav
            id="primary-nav"
            className={`primary-nav${open ? ' is-open' : ''}`}
            aria-label="Primary"
          >
            <ul id="primary-menu">
              {menu.map((item) => {
                const hasChildren = item.children.length > 0;
                const isExpanded = expanded === item.id;
                return (
                  <li
                    key={item.id}
                    className={[
                      'menu-item',
                      hasChildren ? 'menu-item-has-children' : '',
                      isExpanded ? 'is-expanded' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Link
                      href={item.path}
                      onClick={(e) => {
                        // Below the desktop breakpoint the parent link doubles as
                        // the submenu toggle — otherwise children are unreachable.
                        if (hasChildren && window.matchMedia('(max-width: 1180px)').matches) {
                          e.preventDefault();
                          setExpanded(isExpanded ? null : item.id);
                        }
                      }}
                    >
                      {item.title}
                    </Link>
                    {hasChildren && (
                      <ul className="sub-menu">
                        {item.children.map((child) => (
                          <li key={child.id} className="menu-item">
                            <Link href={child.path}>{child.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-actions">
            <Link className="wbah-btn wbah-btn--cta wbah-btn--sm" href="/get-a-valuation/">
              Make Me An Offer <span aria-hidden="true">›</span>
            </Link>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="primary-nav"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
