import { SignJWT, jwtVerify } from 'jose';

/**
 * Admin session.
 *
 * The session is a signed JWT in an HttpOnly cookie — no server-side session
 * store, which suits a serverless deployment. Verification is deliberately
 * dependency-light so the same code runs in middleware (edge) and in route
 * handlers (node).
 */
export const SESSION_COOKIE = 'sh_admin';
const ISSUER = 'solutech-house';
const AUDIENCE = 'admin';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or too short — set a value of at least 32 characters.'
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}
