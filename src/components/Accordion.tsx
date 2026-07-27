'use client';

import { useState } from 'react';

export interface AccordionEntry {
  id: number | string;
  question: string;
  answer: string;
}

/**
 * FAQ accordion. The panel animates via CSS grid-template-rows on `.is-open`,
 * so the only job here is toggling the class and keeping aria-expanded honest.
 */
export default function Accordion({ entries }: { entries: AccordionEntry[] }) {
  const [open, setOpen] = useState<Set<AccordionEntry['id']>>(new Set());

  const toggle = (id: AccordionEntry['id']) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <div className="wbah-accordion" data-reveal>
      {entries.map((entry) => {
        const isOpen = open.has(entry.id);
        return (
          <div key={entry.id} className={`wbah-acc${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="wbah-acc__q"
              aria-expanded={isOpen}
              onClick={() => toggle(entry.id)}
            >
              <span>{entry.question}</span>
            </button>
            <div className="wbah-acc__panel">
              <div
                className="wbah-acc__a"
                dangerouslySetInnerHTML={{ __html: entry.answer }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
