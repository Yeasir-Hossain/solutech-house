import type { Metadata } from 'next';
import { getAll } from '@/lib/content';
import CtaBand from '@/components/CtaBand';
import FaqSearch from '@/components/FaqSearch';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Everything you need to know about selling your house to us — fees, timescales, valuations and completion.',
  alternates: { canonical: '/faqs/' },
};

export default function FaqArchive() {
  const faqs = getAll('faq');
  return (
    <>
      <PageHero
        title="Frequently asked questions"
        subtitle="Everything you need to know about selling your house to us. Search below or browse the questions."
      />
      <section className="wbah-section">
        <div className="wbah-container wbah-container--narrow">
          <FaqSearch
            entries={faqs.map((f) => ({ id: f.id, question: f.title, answer: f.content }))}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
