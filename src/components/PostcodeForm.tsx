'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Site-wide postcode capture (hero + CTA band). Submits to the valuation page
 * with ?postcode=, which the 3-step form prefills.
 *
 * Suggestions come from postcodes.io — free and key-less. It is a plain GET
 * form, so it still works with JS disabled; autocomplete is an enhancement.
 */
export default function PostcodeForm({ cta = 'Get my offer' }: { cta?: string }) {
  const id = useId();
  const listId = `${id}-list`;
  const [value, setValue] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setItems([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(query)}/autocomplete`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) => setItems(Array.isArray(d?.result) ? d.result : []))
        .catch(() => {
          /* offline or aborted — suggestions are optional */
        });
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setItems([]);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const choose = (code: string) => {
    setValue(code);
    setItems([]);
    setActive(-1);
  };

  const open = items.length > 0;

  return (
    <form
      className="wbah-postcode-form"
      action="/get-a-valuation/"
      method="get"
      role="search"
      aria-label="Get a cash offer"
    >
      <label className="screen-reader-text" htmlFor={id}>
        Your postcode
      </label>
      <div className="wbah-postcode-form__field" ref={rootRef}>
        <input
          id={id}
          name="postcode"
          type="text"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          placeholder="Enter your postcode"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && active >= 0) {
              e.preventDefault();
              choose(items[active]);
            } else if (e.key === 'Escape') {
              setItems([]);
            }
          }}
        />
        <ul className="wbah-postcode-form__list" id={listId} role="listbox" hidden={!open}>
          {items.map((code, i) => (
            /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
            <li
              key={code}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(code);
              }}
            >
              {code}
            </li>
          ))}
        </ul>
      </div>
      <button type="submit" className="wbah-btn wbah-btn--primary">
        {cta}
      </button>
    </form>
  );
}
