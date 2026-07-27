import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Never bounce to an attacker-supplied absolute URL after sign-in.
  const safeNext = next && next.startsWith('/admin') ? next : '';
  return <LoginForm next={safeNext} />;
}
