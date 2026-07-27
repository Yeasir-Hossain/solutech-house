import Link from 'next/link';

interface Props {
  page: number;
  totalPages: number;
  /** Base path, e.g. "/blog" or "/blog/category/divorce". */
  basePath: string;
}

/** Page 1 lives at the base path; later pages at <base>/page/<n>/. */
export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
}

export default function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  // Compact window around the current page, mirroring WP's mid_size of 2.
  const window = 2;
  const numbers: (number | 'gap')[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= window) {
      numbers.push(n);
    } else if (numbers[numbers.length - 1] !== 'gap') {
      numbers.push('gap');
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="nav-links">
        {page > 1 ? (
          <Link className="prev page-numbers" href={pageHref(basePath, page - 1)}>
            ‹ Previous
          </Link>
        ) : null}

        {numbers.map((n, i) =>
          n === 'gap' ? (
            <span className="page-numbers dots" key={`gap-${i}`}>
              …
            </span>
          ) : n === page ? (
            <span className="page-numbers current" key={n} aria-current="page">
              {n}
            </span>
          ) : (
            <Link className="page-numbers" href={pageHref(basePath, n)} key={n}>
              {n}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link className="next page-numbers" href={pageHref(basePath, page + 1)}>
            Next ›
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
