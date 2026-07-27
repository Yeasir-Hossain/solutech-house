import Link from 'next/link';
import { listLeads, type LeadStatus } from '@/lib/leads';
import { isConfigured } from '@/lib/mongo';
import { COMPANY } from '@/lib/site';
import { logout, requireAdmin, updateStatus } from './actions';

export const dynamic = 'force-dynamic';

const STATUSES: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'closed'];
const STATUS_LABEL: Record<string, string> = {
  all: 'All enquiries',
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== 'all' && v !== 1) search.set(k, String(v));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const user = await requireAdmin();
  const { q = '', status = 'all', page = '1' } = await searchParams;

  const activeStatus = (STATUSES as string[]).includes(status)
    ? (status as LeadStatus | 'all')
    : 'all';

  if (!isConfigured()) {
    return (
      <div className="sh-admin">
        <Bar user={user} />
        <div className="sh-admin__wrap">
          <h1>Submissions</h1>
          <p className="sh-error">
            <strong>MONGODB_URI is not set.</strong> Add the connection string to the environment
            and redeploy — submissions cannot be read or stored without it.
          </p>
        </div>
      </div>
    );
  }

  let data;
  try {
    data = await listLeads({ search: q, status: activeStatus, page: Number(page) || 1 });
  } catch (err) {
    console.error('Failed to load leads:', err);
    return (
      <div className="sh-admin">
        <Bar user={user} />
        <div className="sh-admin__wrap">
          <h1>Submissions</h1>
          <p className="sh-error">
            Couldn’t reach the database. Check the connection string and that this deployment’s IP
            is allowed in Atlas Network Access.
          </p>
        </div>
      </div>
    );
  }

  const { leads, total, totalPages, counts } = data;

  return (
    <div className="sh-admin">
      <Bar user={user} />

      <div className="sh-admin__wrap">
        <h1>Submissions</h1>
        <p className="sh-admin__sub">
          Valuation enquiries from the website, newest first.
          {q ? ` Filtered by “${q}”.` : ''}
        </p>

        <div className="sh-stats">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/${buildQuery({ q, status: s })}`}
              className={`sh-stat${activeStatus === s ? ' is-active' : ''}`}
            >
              <span className="sh-stat__num">{counts[s]}</span>
              <span className="sh-stat__label">{STATUS_LABEL[s]}</span>
            </Link>
          ))}
        </div>

        <div className="sh-toolbar">
          <form method="get" action="/admin/">
            {activeStatus !== 'all' ? (
              <input type="hidden" name="status" value={activeStatus} />
            ) : null}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, email, phone, postcode…"
              aria-label="Search submissions"
            />
            <button type="submit" className="sh-btn sh-btn--primary">
              Search
            </button>
            {q ? (
              <Link className="sh-btn sh-btn--ghost" href={`/admin/${buildQuery({ status: activeStatus })}`}>
                Clear
              </Link>
            ) : null}
          </form>
          <a className="sh-btn sh-btn--ghost" href="/api/admin/export">
            Download CSV
          </a>
        </div>

        <div className="sh-tablewrap">
          {leads.length ? (
            <table className="sh-table">
              <thead>
                <tr>
                  <th scope="col">Received</th>
                  <th scope="col">Name</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Property</th>
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="sh-muted">{dateFormat.format(new Date(lead.createdAt))}</td>
                    <td>
                      <div className="sh-name">
                        {lead.firstName} {lead.lastName}
                      </div>
                    </td>
                    <td>
                      <div>
                        <a href={`tel:${lead.phone.replace(/\s+/g, '')}`}>{lead.phone}</a>
                      </div>
                      {lead.email ? (
                        <div className="sh-muted">
                          <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        </div>
                      ) : (
                        <div className="sh-muted">No email given</div>
                      )}
                    </td>
                    <td>
                      <div>{lead.propertyType}</div>
                      <div className="sh-muted">{lead.bedrooms} bed</div>
                    </td>
                    <td>
                      <div className="sh-name">{lead.postcode}</div>
                      {lead.address ? <div className="sh-muted">{lead.address}</div> : null}
                    </td>
                    <td>
                      <form action={updateStatus} className="sh-status-form">
                        <input type="hidden" name="id" value={lead.id} />
                        <span className={`sh-pill sh-pill--${lead.status}`}>{lead.status}</span>
                        <select name="status" defaultValue={lead.status} aria-label="Change status">
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button type="submit" className="sh-btn sh-btn--ghost" style={{ padding: '6px 10px' }}>
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="sh-empty">
              {q || activeStatus !== 'all'
                ? 'No submissions match that filter.'
                : 'No submissions yet. They’ll appear here as soon as the valuation form is used.'}
            </p>
          )}
        </div>

        {totalPages > 1 ? (
          <nav className="sh-pager" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
              n === data.page ? (
                <span key={n} className="is-current" aria-current="page">
                  {n}
                </span>
              ) : (
                <Link key={n} href={`/admin/${buildQuery({ q, status: activeStatus, page: n })}`}>
                  {n}
                </Link>
              )
            )}
          </nav>
        ) : null}

        <p className="sh-admin__sub" style={{ marginTop: 18 }}>
          Showing {leads.length} of {total} matching {total === 1 ? 'enquiry' : 'enquiries'}.
        </p>
      </div>
    </div>
  );
}

function Bar({ user }: { user: string }) {
  return (
    <div className="sh-admin__bar">
      <div className="sh-admin__brand">
        {COMPANY.logo.first}
        <span>{COMPANY.logo.second}</span>
      </div>
      <div className="sh-admin__bar-actions">
        <span className="sh-admin__user">Signed in as {user}</span>
        <form action={logout}>
          <button type="submit" className="sh-btn sh-btn--link">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
