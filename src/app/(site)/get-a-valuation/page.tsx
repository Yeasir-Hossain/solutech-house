import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getBySlug } from '@/lib/content';
import PageHero from '@/components/PageHero';
import ValuationForm from '@/components/ValuationForm';
import { TrustLogos } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Get a valuation',
  description:
    'Get your free, no-obligation cash offer in as little as 15 minutes. Tell us about your property in three quick steps.',
  alternates: { canonical: '/get-a-valuation/' },
};

/**
 * The CTA band is deliberately absent: this page already carries the form, so
 * pushing the visitor toward it again would only add scroll between them and
 * the thing they came to do.
 */
export default function GetAValuation() {
  const page = getBySlug('page', 'get-a-valuation');

  return (
    <>
      <PageHero
        title="Get your offer now"
        subtitle="We make selling your house fast and hassle free. No hidden costs, obligations or last-minute renegotiations in price."
        image={page?.featured}
      />

      <section className="wbah-section">
        <div className="wbah-container wbah-container--narrow">
          <Suspense fallback={<div className="wbah-val" aria-busy="true" />}>
            <ValuationForm />
          </Suspense>
        </div>
      </section>

      <TrustLogos />
    </>
  );
}
