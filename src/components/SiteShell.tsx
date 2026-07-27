import { getMenu } from '@/lib/content';
import Header from './Header';
import Footer from './Footer';

/** Header + main + footer chrome shared by every public page. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header menu={getMenu('primary')} />
      <main id="main" className="site-main">
        {children}
      </main>
      <Footer />
    </>
  );
}
