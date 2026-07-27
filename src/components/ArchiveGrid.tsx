import type { Item } from '@/lib/types';
import Card from './Card';
import Pagination from './Pagination';

interface Props {
  items: Item[];
  page?: number;
  totalPages?: number;
  basePath?: string;
  empty?: string;
}

/** Card grid + pagination — the shape every listing archive uses. */
export default function ArchiveGrid({
  items,
  page = 1,
  totalPages = 1,
  basePath = '',
  empty = 'Nothing here yet.',
}: Props) {
  return (
    <section className="wbah-section">
      <div className="wbah-container">
        {items.length ? (
          <>
            <div className="wbah-card-grid">
              {items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <p>{empty}</p>
        )}
      </div>
    </section>
  );
}
