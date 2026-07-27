import type { Metadata } from 'next';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: 'Submissions',
  robots: { index: false, follow: false, nocache: true },
};

/** The admin area sits outside the public site chrome — no header, nav or footer. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
