import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAll, getBySlug, getPosts } from '@/lib/content';
import { formatDate } from '@/lib/text';
import { itemMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';
import { ArticleGrid, FaqsSection, Prose, SliderSection, TrustLogos } from '@/components/sections';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAll('post').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBySlug('post', slug);
  return post ? itemMetadata(post, 'article') : {};
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBySlug('post', slug);
  if (!post) notFound();

  const category = post.categories[0];
  const related = category
    ? getPosts({ category: category.slug, limit: 8, excludeId: post.id })
    : [];

  return (
    <>
      <PageHero title={post.title} image={post.featured} />

      <ArticleGrid>
        <div data-reveal>
          <div className="entry-meta">
            {category ? (
              <Link className="entry-cat" href={`/blog/category/${category.slug}/`}>
                {category.name}
              </Link>
            ) : null}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <Prose html={post.content} />
        </div>
      </ArticleGrid>

      <TrustLogos />

      {related.length ? (
        <SliderSection
          items={related}
          eyebrow="Keep reading"
          heading={`More on ${category.name}`}
          viewAll={`/blog/category/${category.slug}/`}
          alt
        />
      ) : null}

      <FaqsSection limit={6} />
      <CtaBand />
    </>
  );
}
