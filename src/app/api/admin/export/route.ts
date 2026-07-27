import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';
import { allLeads } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLUMNS = [
  'Received',
  'First name',
  'Last name',
  'Email',
  'Phone',
  'Postcode',
  'Address',
  'Property type',
  'Bedrooms',
  'Status',
  'Source page',
] as const;

/**
 * RFC 4180 quoting. The leading apostrophe on formula-looking values stops a
 * spreadsheet treating a submitted field as a formula on open.
 */
function csvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export async function GET() {
  // Middleware already gates /api/admin/*, but this endpoint hands out every
  // stored contact detail — it re-checks rather than trusting the front door.
  const store = await cookies();
  if (!(await verifySession(store.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const leads = await allLeads();
  const rows = leads.map((lead) =>
    [
      lead.createdAt.toISOString(),
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.phone,
      lead.postcode,
      lead.address,
      lead.propertyType,
      lead.bedrooms,
      lead.status,
      lead.sourceUrl,
    ]
      .map(csvCell)
      .join(',')
  );

  // BOM so Excel opens UTF-8 correctly.
  const csv = `﻿${COLUMNS.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="submissions-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
