'use server';

import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, createSession, sessionCookieOptions, verifySession } from '@/lib/auth';
import { getDb } from '@/lib/mongo';
import { hashIp, setLeadStatus, type LeadStatus } from '@/lib/leads';

const MAX_ATTEMPTS = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

/** Constant-time comparison — a plain `===` leaks the shared prefix length. */
function safeEqual(a: string, b: string): boolean {
  // timingSafeEqual throws on length mismatch, so compare fixed-size digests.
  const digestA = crypto.createHash('sha256').update(a).digest();
  const digestB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip') || 'unknown';
}

/**
 * Failed logins are counted in Mongo rather than in memory: a serverless
 * deployment runs many instances, and an in-process counter would reset on
 * every cold start — which is exactly what a brute-force run produces.
 */
async function attemptsCollection() {
  const db = await getDb();
  const col = db.collection('admin_login_attempts');
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
  await col.createIndex({ ipHash: 1, createdAt: -1 });
  return col;
}

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    return { error: 'Admin credentials are not configured on the server.' };
  }

  const ip = await clientIp();
  let attempts;
  try {
    attempts = await attemptsCollection();
    const recent = await attempts.countDocuments({
      ipHash: hashIp(ip),
      createdAt: { $gt: new Date(Date.now() - ATTEMPT_WINDOW_MS) },
    });
    if (recent >= MAX_ATTEMPTS) {
      return { error: 'Too many failed attempts. Try again in 15 minutes.' };
    }
  } catch (err) {
    // A database outage must not turn into an open door.
    console.error('Login throttle unavailable:', err);
    return { error: 'Sign-in is temporarily unavailable. Please try again shortly.' };
  }

  // Evaluate both comparisons so the response time doesn't reveal which failed.
  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPass);
  if (!userOk || !passOk) {
    await attempts.insertOne({ ipHash: hashIp(ip), createdAt: new Date() });
    return { error: 'Incorrect username or password.' };
  }

  await attempts.deleteMany({ ipHash: hashIp(ip) });

  const token = await createSession(expectedUser);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());

  // Only ever redirect within this site.
  redirect(next.startsWith('/admin') ? next : '/admin/');
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login/');
}

/** Guard for anything that reads or writes lead data. */
export async function requireAdmin(): Promise<string> {
  const store = await cookies();
  const user = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!user) redirect('/admin/login/');
  return user;
}

export async function updateStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as LeadStatus;
  if (!['new', 'contacted', 'closed'].includes(status)) return;
  await setLeadStatus(id, status);
  revalidatePath('/admin');
}
