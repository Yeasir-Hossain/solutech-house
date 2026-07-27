import { NextResponse } from 'next/server';
import { insertLead, recentSubmissionCount } from '@/lib/leads';
import { isConfigured } from '@/lib/mongo';
import { validateLead, type LeadPayload } from '@/lib/valuation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Max submissions accepted from one client inside the window. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Strip control characters and clamp length before anything is stored. */
function clean(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot and time trap. Both respond as success so a bot gets no signal
  // about which check rejected it.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true, message: 'Thanks — we’ll be in touch.' });
  }
  const elapsed = typeof body.elapsed === 'number' ? body.elapsed : 9999;
  if (elapsed < 2) {
    return NextResponse.json({ ok: true, message: 'Thanks — we’ll be in touch.' });
  }

  const values = {
    postcode: clean(body.postcode, 12),
    address: clean(body.address, 250),
    property_type: clean(body.property_type, 40),
    bedrooms: clean(body.bedrooms, 4),
    first_name: clean(body.first_name, 80),
    last_name: clean(body.last_name, 80),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
  };

  const errors = validateLead(values);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { ok: false, errors, message: 'Please check the highlighted fields.' },
      { status: 422 }
    );
  }

  if (!isConfigured()) {
    console.error('Lead submitted but MONGODB_URI is not configured.');
    return NextResponse.json(
      { ok: false, message: 'We couldn’t save your request. Please call us instead.' },
      { status: 503 }
    );
  }

  const ip = clientIp(req);

  try {
    if ((await recentSubmissionCount(ip, RATE_WINDOW_MS)) >= RATE_LIMIT) {
      return NextResponse.json(
        { ok: false, message: 'You’ve already sent a few requests — we’ll be in touch shortly.' },
        { status: 429 }
      );
    }

    await insertLead({
      postcode: values.postcode,
      address: values.address,
      propertyTypeKey: values.property_type,
      bedrooms: values.bedrooms,
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
      phone: values.phone,
      sourceUrl: clean(req.headers.get('referer'), 500),
      userAgent: clean(req.headers.get('user-agent'), 300),
      ip,
    });
  } catch (err) {
    console.error('Failed to store lead:', err);
    return NextResponse.json(
      { ok: false, message: 'Something went wrong saving your request. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Thanks! We’ve received your details and will be in touch shortly with your offer.',
  });
}
