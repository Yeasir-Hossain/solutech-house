'use client';

import { useMemo, useState } from 'react';
import Accordion, { type AccordionEntry } from './Accordion';
import { stripTags } from '@/lib/text';

interface Entry extends AccordionEntry {
  /** Pre-lowercased haystack so filtering doesn't strip tags on every keystroke. */
  haystack: string;
}

/**
 * FAQ list with search. WordPress did this as a server round-trip on ?fq=;
 * with the whole set already on the page, filtering client-side is instant and
 * keeps the route static.
 */
export default function FaqSearch({ entries }: { entries: AccordionEntry[] }) {
  const [query, setQuery] = useState('');

  const indexed = useMemo<Entry[]>(
    () =>
      entries.map((e) => ({
        ...e,
        haystack: `${e.question} ${stripTags(e.answer)}`.toLowerCase(),
      })),
    [entries]
  );

  const term = query.trim().toLowerCase();
  const results = term ? indexed.filter((e) => e.haystack.includes(term)) : indexed;

  return (
    <>
      <form className="wbah-faq-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="screen-reader-text" htmlFor="wbah-faq-q">
          Search FAQs
        </label>
        <input
          type="search"
          id="wbah-faq-q"
          name="fq"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions… e.g. fees, completion, probate"
        />
        <button type="submit" className="wbah-btn wbah-btn--primary">
          Search
        </button>
      </form>

      {term ? (
        <p className="wbah-faq-searchinfo">
          {results.length} result{results.length === 1 ? '' : 's'} for “{query.trim()}”.{' '}
          <button
            type="button"
            className="wbah-card__more"
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
          >
            Clear
          </button>
        </p>
      ) : null}

      {results.length ? (
        <Accordion entries={results} />
      ) : (
        <p>No FAQs matched that search. Try a different word.</p>
      )}
    </>
  );
}
