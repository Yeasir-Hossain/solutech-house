import SiteShell from '@/components/SiteShell';

/** Public site chrome. The admin area sits outside this group and has none of it. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
