'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyIcon from './PropertyIcon';
import {
  BEDROOM_OPTIONS,
  PROPERTY_TYPES,
  type LeadPayload,
  type LeadResponse,
  type PropertyType,
  validateLead,
} from '@/lib/valuation';

type Errors = Record<string, string>;

const STEP_LABELS = ['Address', 'Property Details', 'Contact Details'];

const EMPTY: LeadPayload = {
  postcode: '',
  address: '',
  property_type: '',
  bedrooms: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: '',
  elapsed: 0,
};

/** Fields owned by each step, so "Next" only validates what's on screen. */
const STEP_FIELDS: string[][] = [
  ['postcode'],
  ['property_type', 'bedrooms'],
  ['first_name', 'last_name', 'phone', 'email'],
];

export default function ValuationForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<LeadPayload>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const startedAt = useRef(Date.now());
  const rootRef = useRef<HTMLElement>(null);

  // Hero and CTA postcode forms link here with ?postcode=.
  useEffect(() => {
    const prefill = searchParams.get('postcode');
    if (prefill) setValues((v) => (v.postcode ? v : { ...v, postcode: prefill }));
  }, [searchParams]);

  /* ---- postcode autocomplete (postcodes.io — free, no key) ---- */
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const lookupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = values.postcode.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(query)}/autocomplete`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) => setSuggestions(Array.isArray(d?.result) ? d.result : []))
        .catch(() => {
          /* suggestions are an enhancement — typing still works */
        });
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [values.postcode]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!lookupRef.current?.contains(e.target as Node)) setSuggestions([]);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const set = (name: keyof LeadPayload, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  };

  const goTo = (next: number) => {
    setStep(next);
    setFormError('');
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep = (which: number): boolean => {
    const all = validateLead(values);
    const scoped = Object.fromEntries(
      Object.entries(all).filter(([k]) => STEP_FIELDS[which - 1].includes(k))
    );
    setErrors(scoped);
    return Object.keys(scoped).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let s = 1; s <= 3; s++) {
      if (!validateStep(s)) {
        goTo(s);
        return;
      }
    }

    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          elapsed: Math.round((Date.now() - startedAt.current) / 1000),
        }),
      });
      const data: LeadResponse = await res.json();
      if (data.ok) {
        setSuccess(data.message || 'Thanks — we’ll be in touch.');
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        if (data.errors) setErrors(data.errors);
        setFormError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: string) =>
    errors[name] ? (
      <span className="wbah-val__error" data-error-for={name}>
        {errors[name]}
      </span>
    ) : null;

  const wrapClass = (name: string) =>
    `wbah-val__field${errors[name] ? ' has-error' : ''}`;

  return (
    <section className="wbah-val" aria-labelledby="wbah-val-title" ref={rootRef}>
      <div className="wbah-val__head">
        <h2 id="wbah-val-title" className="wbah-val__title">
          Get Your <span>Offer Now</span>.
        </h2>
        <p className="wbah-val__sub">
          We make selling your house fast and hassle free. No hidden costs, obligations or
          last-minute renegotiations in price.
        </p>
      </div>

      {success ? (
        <div className="wbah-val__success" role="status">
          <div className="wbah-val__success-icon">✓</div>
          <h3>Thank you!</h3>
          <p>{success}</p>
        </div>
      ) : (
        <>
          <ol className="wbah-val__steps" aria-hidden="true">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              return (
                <li
                  key={label}
                  className={[n === step ? 'is-active' : '', n < step ? 'is-done' : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="wbah-val__num">{n}</span>
                  {label}
                </li>
              );
            })}
          </ol>

          <form className="wbah-val__form" noValidate onSubmit={onSubmit}>
            {formError ? (
              <p className="wbah-val__error wbah-val__error--form" role="alert">
                {formError}
              </p>
            ) : null}

            {/* Step 1 — address */}
            <fieldset className="wbah-val__panel is-active" hidden={step !== 1}>
              <legend className="screen-reader-text">Address</legend>

              <div
                className={`wbah-val__field wbah-val__field--lookup${errors.postcode ? ' has-error' : ''}`}
                ref={lookupRef}
              >
                <label htmlFor="wbah-postcode">
                  Postcode <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="wbah-postcode"
                  name="postcode"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={suggestions.length > 0}
                  aria-autocomplete="list"
                  aria-controls="wbah-postcode-list"
                  placeholder="Start typing your postcode…"
                  value={values.postcode}
                  onChange={(e) => set('postcode', e.target.value)}
                  onKeyDown={(e) => {
                    if (!suggestions.length) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveSuggestion((i) => Math.max(i - 1, 0));
                    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
                      e.preventDefault();
                      set('postcode', suggestions[activeSuggestion]);
                      setSuggestions([]);
                      setActiveSuggestion(-1);
                    } else if (e.key === 'Escape') {
                      setSuggestions([]);
                    }
                  }}
                />
                <ul
                  id="wbah-postcode-list"
                  className="wbah-val__dropdown"
                  role="listbox"
                  hidden={!suggestions.length}
                >
                  {suggestions.map((code, i) => (
                    <li
                      key={code}
                      role="option"
                      aria-selected={i === activeSuggestion}
                      className={i === activeSuggestion ? 'is-active' : undefined}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        set('postcode', code);
                        setSuggestions([]);
                        setActiveSuggestion(-1);
                      }}
                    >
                      {code}
                    </li>
                  ))}
                </ul>
                {fieldError('postcode')}
              </div>

              <div className="wbah-val__field">
                <label htmlFor="wbah-address">Address</label>
                <input
                  type="text"
                  id="wbah-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="House name / number and street"
                  value={values.address}
                  onChange={(e) => set('address', e.target.value)}
                />
              </div>

              <div className="wbah-val__nav">
                <span />
                <button
                  type="button"
                  className="wbah-btn wbah-btn--primary"
                  onClick={() => validateStep(1) && goTo(2)}
                >
                  Go ›
                </button>
              </div>
            </fieldset>

            {/* Step 2 — property */}
            <fieldset className="wbah-val__panel" hidden={step !== 2}>
              <legend className="wbah-val__label">
                What type of property is that? <span className="req">*</span>
              </legend>
              <div className="wbah-val__tiles" role="radiogroup" aria-label="Property type">
                {(Object.keys(PROPERTY_TYPES) as PropertyType[]).map((key) => (
                  <label
                    key={key}
                    className={`wbah-tile${values.property_type === key ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="property_type"
                      value={key}
                      checked={values.property_type === key}
                      onChange={() => set('property_type', key)}
                    />
                    <span className="wbah-tile__icon">
                      <PropertyIcon type={key} />
                    </span>
                    <span className="wbah-tile__label">{PROPERTY_TYPES[key]}</span>
                  </label>
                ))}
              </div>
              {fieldError('property_type')}

              <div className={`${wrapClass('bedrooms')} wbah-val__field--beds`}>
                <span className="wbah-val__label">
                  Number of bedrooms? <span className="req">*</span>
                </span>
                <div className="wbah-val__beds" role="radiogroup" aria-label="Number of bedrooms">
                  {BEDROOM_OPTIONS.map((b) => (
                    <label
                      key={b}
                      className={`wbah-bed${values.bedrooms === b ? ' is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="bedrooms"
                        value={b}
                        checked={values.bedrooms === b}
                        onChange={() => set('bedrooms', b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
                {fieldError('bedrooms')}
              </div>

              <p className="wbah-val__note">
                <strong>Please note:</strong> We are not currently purchasing properties over
                £700,000 in value (except in London).
              </p>

              <div className="wbah-val__nav">
                <button type="button" className="wbah-btn wbah-btn--muted" onClick={() => goTo(1)}>
                  ‹ Previous
                </button>
                <button
                  type="button"
                  className="wbah-btn wbah-btn--primary"
                  onClick={() => validateStep(2) && goTo(3)}
                >
                  Next ›
                </button>
              </div>
            </fieldset>

            {/* Step 3 — contact */}
            <fieldset className="wbah-val__panel" hidden={step !== 3}>
              <legend className="screen-reader-text">Contact details</legend>

              <div className="wbah-val__row">
                <div className={wrapClass('first_name')}>
                  <label htmlFor="wbah-first">
                    First name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="wbah-first"
                    name="first_name"
                    autoComplete="given-name"
                    value={values.first_name}
                    onChange={(e) => set('first_name', e.target.value)}
                  />
                  {fieldError('first_name')}
                </div>
                <div className={wrapClass('last_name')}>
                  <label htmlFor="wbah-last">
                    Last name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="wbah-last"
                    name="last_name"
                    autoComplete="family-name"
                    value={values.last_name}
                    onChange={(e) => set('last_name', e.target.value)}
                  />
                  {fieldError('last_name')}
                </div>
              </div>

              <div className={wrapClass('email')}>
                <label htmlFor="wbah-email">Email address</label>
                <input
                  type="email"
                  id="wbah-email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                />
                {fieldError('email')}
              </div>

              <div className={wrapClass('phone')}>
                <label htmlFor="wbah-phone">
                  Phone <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="wbah-phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="e.g. 07221 358935"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
                {fieldError('phone')}
              </div>

              {/* Honeypot — hidden from users, tempting to bots. */}
              <div className="wbah-val__hp" aria-hidden="true">
                <label htmlFor="wbah-company">Company (leave blank)</label>
                <input
                  type="text"
                  id="wbah-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={(e) => set('company', e.target.value)}
                />
              </div>

              <div className="wbah-val__nav">
                <button type="button" className="wbah-btn wbah-btn--muted" onClick={() => goTo(2)}>
                  ‹ Previous
                </button>
                <button
                  type="submit"
                  className={`wbah-btn wbah-btn--cta${submitting ? ' is-loading' : ''}`}
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </fieldset>
          </form>
        </>
      )}
    </section>
  );
}
