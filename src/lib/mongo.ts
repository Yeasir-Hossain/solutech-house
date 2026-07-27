import 'server-only';
import { MongoClient, type Db } from 'mongodb';

/**
 * MongoDB connection for a serverless runtime.
 *
 * Each warm lambda reuses one client (and therefore one pool) via a module-level
 * promise; opening a connection per request would exhaust the Atlas connection
 * limit under any real traffic.
 */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'solutechhouse';

let clientPromise: Promise<MongoClient> | undefined;

function connect(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set — add it to .env.local or the Vercel project env.');
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, {
      // Fail fast rather than hanging a request for the default 30s.
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
      retryWrites: true,
    }).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  return client.db(dbName);
}

/** True when a connection string is configured at all. */
export function isConfigured(): boolean {
  return Boolean(uri);
}
