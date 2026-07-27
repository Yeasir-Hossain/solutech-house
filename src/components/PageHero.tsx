import type { Image } from '@/lib/content';
import PostcodeForm from './PostcodeForm';

interface Props {
  title: string;
  subtitle?: string;
  image?: Image | null;
  imageUrl?: string;
  form?: boolean;
  points?: string[];
}

/** Inner-page hero: dark gradient banner over an image, with optional form. */
export default function PageHero({ title, subtitle, image, imageUrl, form, points }: Props) {
  const bg = imageUrl || image?.src || '/img/city.avif';
  return (
    <section
      className="wbah-page-hero has-image"
      style={{ ['--hero-img' as string]: `url('${bg}')` }}
    >
      <div className="wbah-page-hero__overlay" />
      <div className="wbah-container" data-reveal>
        <h1 className="wbah-page-hero__title">{title}</h1>
        {subtitle ? <p className="wbah-page-hero__sub">{subtitle}</p> : null}

        {points?.length ? (
          <ul className="wbah-hero-points">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}

        {form ? <PostcodeForm /> : null}
      </div>
    </section>
  );
}
