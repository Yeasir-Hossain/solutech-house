import 'server-only';
import crypto from 'node:crypto';
import type { Collection, Filter, WithId } from 'mongodb';
import { getDb } from './mongo';
import { PROPERTY_TYPES, type PropertyType } from './valuation';

export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface Lead {
  postcode: string;
  address: string;
  propertyTypeKey: string;
  propertyType: string;
  bedrooms: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date;
  sourceUrl: string;
  userAgent: string;
  /** Salted hash, not the address itself — enough for rate limiting, not tracking. */
  ipHash: string;
}

let indexesReady: Promise<void> | undefined;

async function collection(): Promise<Collection<Lead>> {
  const db = await getDb();
  const leads = db.collection<Lead>('leads');
  // Created once per warm instance; createIndex is idempotent on Atlas.
  indexesReady ??= (async () => {
    await leads.createIndex({ createdAt: -1 });
    await leads.createIndex({ ipHash: 1, createdAt: -1 });
    await leads.createIndex({ status: 1, createdAt: -1 });
  })();
  await indexesReady;
  return leads;
}

/**
 * Hash the client address with the app secret so the stored value can be
 * compared for rate limiting but cannot be reversed into an IP.
 */
export function hashIp(ip: string): string {
  return crypto
    .createHmac('sha256', process.env.AUTH_SECRET || 'unset-secret')
    .update(ip)
    .digest('hex');
}

export interface NewLead {
  postcode: string;
  address: string;
  propertyTypeKey: string;
  bedrooms: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sourceUrl: string;
  userAgent: string;
  ip: string;
}

export async function insertLead(input: NewLead): Promise<void> {
  const leads = await collection();
  await leads.insertOne({
    postcode: input.postcode.toUpperCase(),
    address: input.address,
    propertyTypeKey: input.propertyTypeKey,
    propertyType: PROPERTY_TYPES[input.propertyTypeKey as PropertyType] ?? input.propertyTypeKey,
    bedrooms: input.bedrooms,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    status: 'new',
    createdAt: new Date(),
    sourceUrl: input.sourceUrl,
    userAgent: input.userAgent,
    ipHash: hashIp(input.ip),
  });
}

/** How many submissions this client made inside the window. */
export async function recentSubmissionCount(ip: string, windowMs: number): Promise<number> {
  const leads = await collection();
  return leads.countDocuments({
    ipHash: hashIp(ip),
    createdAt: { $gt: new Date(Date.now() - windowMs) },
  });
}

export interface LeadQuery {
  search?: string;
  status?: LeadStatus | 'all';
  page?: number;
  perPage?: number;
}

export type LeadRow = Lead & { id: string };

export interface LeadPage {
  leads: LeadRow[];
  total: number;
  page: number;
  totalPages: number;
  counts: Record<'all' | LeadStatus, number>;
}

/** Escape user input before it reaches a Mongo regex. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listLeads({
  search = '',
  status = 'all',
  page = 1,
  perPage = 25,
}: LeadQuery = {}): Promise<LeadPage> {
  const leads = await collection();

  const filter: Filter<Lead> = {};
  if (status !== 'all') filter.status = status;
  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { firstName: rx },
      { lastName: rx },
      { email: rx },
      { phone: rx },
      { postcode: rx },
      { address: rx },
    ];
  }

  const total = await leads.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);

  const docs = await leads
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((current - 1) * perPage)
    .limit(perPage)
    .toArray();

  const [all, isNew, contacted, closed] = await Promise.all([
    leads.countDocuments({}),
    leads.countDocuments({ status: 'new' }),
    leads.countDocuments({ status: 'contacted' }),
    leads.countDocuments({ status: 'closed' }),
  ]);

  return {
    leads: docs.map(({ _id, ...rest }: WithId<Lead>) => ({ ...rest, id: String(_id) })),
    total,
    page: current,
    totalPages,
    counts: { all, new: isNew, contacted, closed },
  };
}

/** Every lead, oldest first — used for the CSV export. */
export async function allLeads(): Promise<Lead[]> {
  const leads = await collection();
  return leads.find({}).sort({ createdAt: 1 }).toArray();
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const { ObjectId } = await import('mongodb');
  if (!ObjectId.isValid(id)) return false;
  const leads = await collection();
  const res = await leads.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return res.matchedCount === 1;
}
