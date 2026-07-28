/**
 * Content migration: WordPress JSON export -> web/content/*.json.
 *
 * Reads the raw dump produced by _wbah_export.php and normalises it for the
 * Next.js build:
 *   - uploads URLs      -> /media/**.webp (via content/images.json)
 *   - absolute links to webuyanyhouse.co.uk / localhost:8080 -> site-relative
 *   - <img> gets width/height so the layout doesn't shift
 *   - featured images resolved to their migrated file
 *
 * Run after build-images.mjs (it needs images.json).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.resolve(ROOT, '../wp-content/uploads/_export');
const OUT = path.join(ROOT, 'content');

const TYPES = ['post', 'page', 'faq', 'success_story', 'location', 'reason'];
// Hosts that mean "this site" and must become relative links.
const INTERNAL_HOSTS = new Set([
  'localhost:8080',
  'www.webuyanyhouse.co.uk',
  'webuyanyhouse.co.uk',
]);
// Utility pages that exist in WP but are not worth shipping.
const DROP_SLUGS = new Set(['test', 'test-2']);

/**
 * Rebrand: the migrated copy is written for the old trading name.
 *
 * Only the title-case brand form is replaced. Lower-case "we buy any house" is
 * a descriptive sentence in this copy ("we buy any house, in any condition")
 * and must survive untouched. URL slugs are left alone too — the
 * `we-buy-any-house` blog category keeps its slug so existing links and the
 * redirect map stay valid; only its display name changes.
 */
const BRAND = 'Quick Sell Your House';
const LEGAL = 'Land Invest 7 Limited';
const BRAND_REPLACEMENTS = [
  [/WeBuyAnyHouse/g, BRAND],
  [/We Buy Any House/g, BRAND],
  [/We Buy any House/g, BRAND],
  [/webuyanyhouse\.co\.uk/gi, 'quicksellyourhouse.co.uk'],
  // Bare token, only in the policy pages' copyright line.
  [/©\s*webuyanyhouse/gi, `© ${BRAND}`],
];

function rebrand(text) {
  if (!text) return text;
  return BRAND_REPLACEMENTS.reduce((acc, [from, to]) => acc.replace(from, to), text);
}

/**
 * Legal identity: the four policy pages were imported with the previous
 * operator's three-company block (LXB Equity / Lowerhouse Estates / Alta
 * International). The registered entity is named in the privacy policy only —
 * every other page points there rather than repeating it, and no company
 * number is published.
 */
const ENTITY_BLOCK =
  /which is a trading style \/ trading name used by a collaboration of the following companies:[\s\S]*?United Arab Emirates\./;

const LEGAL_REPLACEMENTS = {
  'privacy-policy': [
    [ENTITY_BLOCK, `which is a trading style of ${LEGAL}.`],
    // Joint-controller wording only made sense while three companies shared the site.
    [
      / We are joint controllers\. As such, we are required to nominate one controller as the central contact point for you\. This is LXB Equity Limited\./,
      ` The data controller is ${LEGAL}.`,
    ],
    // Nominated UK representative: only meaningful while a UAE entity was involved.
    [
      / For Alta International DMCC, you may contact LXB Equity Limited if you wish to contact our nominated representative for data protection within the UK\./,
      '',
    ],
    [/England and DMCC, Dubai, United Arab Emirates depending on the collaboration company/, 'England'],
  ],
  'website-terms': [[ENTITY_BLOCK, LEGAL_ELSEWHERE()]],
  'cookie-policy': [[ENTITY_BLOCK, LEGAL_ELSEWHERE()]],
  'site-acceptable-use-policy': [[ENTITY_BLOCK, LEGAL_ELSEWHERE()]],
};

function LEGAL_ELSEWHERE() {
  return 'which is a trading style of the company named in our Privacy Policy.';
}

// One registered office now, on every page that had the multi-company wording.
const OFFICE_REPLACEMENTS = [
  [/at any of our separate company registered office addresses/g, 'at our registered office'],
  [/for any of our separate companies at our registered offices/g, 'at our registered office'],
  [/you can contact any of our separate company at our registered offices/g, 'you can contact us at our registered office'],
];

function relegal(html, slug) {
  if (!html) return html;
  const rules = [...(LEGAL_REPLACEMENTS[slug] || []), ...OFFICE_REPLACEMENTS];
  return rules.reduce((acc, [from, to]) => acc.replace(from, to), html);
}

const read = async (name) => JSON.parse(await fs.readFile(path.join(SRC, `${name}.json`), 'utf8'));

let images = {};
const stats = { imgRewritten: 0, imgMissing: 0, linksRelative: 0, dropped: 0 };

/** Resolve an uploads-relative file (`2026/07/foo.png`) to its migrated asset. */
function lookupImage(file) {
  if (!file) return null;
  if (images[file]) return images[file];
  // Content sometimes points at a generated variant (foo-768x512.png); the
  // original is what we migrated.
  const original = file.replace(/-\d+x\d+(\.\w+)$/, '$1');
  return images[original] || null;
}

/** Uploads URL -> uploads-relative path, or null when it isn't an uploads URL. */
function uploadsRelative(url) {
  const m = url.match(/\/wp-content\/uploads\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function rewriteUrl(raw) {
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return raw;
  }
  let url;
  try {
    url = new URL(raw, 'http://localhost:8080');
  } catch {
    return raw;
  }
  const isInternal = INTERNAL_HOSTS.has(url.host) || !/^https?:/.test(raw);
  if (!isInternal) return raw;

  const rel = uploadsRelative(url.pathname);
  if (rel) {
    const hit = lookupImage(rel);
    if (hit) {
      stats.imgRewritten++;
      return hit.src;
    }
    stats.imgMissing++;
    return raw;
  }
  if (/^https?:/.test(raw)) stats.linksRelative++;
  return url.pathname + url.search + url.hash;
}

/**
 * Rewrite every src/href in a content blob, and stamp intrinsic width/height on
 * images that we know the dimensions of.
 */
function rewriteContent(html) {
  if (!html) return '';
  let out = html.replace(/(src|href)="([^"]*)"/g, (_m, attr, value) => `${attr}="${rewriteUrl(value)}"`);

  out = out.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/src="([^"]*)"/)?.[1];
    if (!src?.startsWith('/media/')) return tag;
    const hit = Object.values(images).find((i) => i.src === src);
    if (!hit) return tag;
    let next = tag;
    if (!/\bwidth=/.test(next)) next = next.replace(/<img/, `<img width="${hit.width}"`);
    if (!/\bheight=/.test(next)) next = next.replace(/<img/, `<img height="${hit.height}"`);
    if (!/\bloading=/.test(next)) next = next.replace(/<img/, '<img loading="lazy" decoding="async"');
    return next;
  });

  // Strip srcset/sizes: they reference variants we deliberately didn't migrate.
  out = out.replace(/\s(srcset|sizes)="[^"]*"/g, '');
  return out;
}

function normaliseItem(item) {
  const featured = lookupImage(item.featured?.file);
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    path: item.path,
    title: rebrand(item.title),
    excerpt: rebrand(item.excerpt),
    content: relegal(rebrand(rewriteContent(item.content)), item.slug),
    date: item.date,
    modified: item.modified,
    featured: featured
      ? {
          src: featured.src,
          width: featured.width,
          height: featured.height,
          alt: rebrand(item.featured.alt || item.title),
        }
      : null,
    categories: (item.terms || [])
      .filter((t) => t.taxonomy === 'category')
      .map((t) => ({ name: rebrand(t.name), slug: t.slug })),
    menuOrder: item.menuOrder,
  };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  images = JSON.parse(await fs.readFile(path.join(OUT, 'images.json'), 'utf8'));
  console.log(`image map: ${Object.keys(images).length} entries`);

  const bundle = {};
  for (const type of TYPES) {
    const raw = await read(type);
    const items = raw
      .filter((i) => {
        if (DROP_SLUGS.has(i.slug)) {
          stats.dropped++;
          return false;
        }
        return true;
      })
      .map(normaliseItem);
    bundle[type] = items;
    await fs.writeFile(path.join(OUT, `${type}.json`), JSON.stringify(items));
    console.log(`  ${type.padEnd(15)} ${String(items.length).padStart(4)}`);
  }

  // Taxonomies + menus pass through with paths normalised. Slugs are untouched.
  const taxonomies = await read('taxonomies');
  for (const terms of Object.values(taxonomies)) {
    for (const term of terms) {
      term.name = rebrand(term.name);
      term.description = rebrand(term.description);
    }
  }
  await fs.writeFile(path.join(OUT, 'taxonomies.json'), JSON.stringify(taxonomies));

  const menus = await read('menus');
  for (const [location, items] of Object.entries(menus)) {
    // `url` is the absolute WordPress permalink. Nothing renders it, but the
    // menu is passed to a client component, so leaving it in ships the old
    // host in every page's payload.
    menus[location] = items.map(({ url, ...item }) => ({
      ...item,
      title: rebrand(item.title),
      path: item.external ? item.path : rewriteUrl(url),
    }));
  }
  await fs.writeFile(path.join(OUT, 'menus.json'), JSON.stringify(menus));

  const site = await read('site');
  await fs.writeFile(
    path.join(OUT, 'site.json'),
    JSON.stringify({
      name: BRAND,
      description: rebrand(site.description),
      counts: Object.fromEntries(TYPES.map((t) => [t, bundle[t].length])),
      generatedAt: new Date().toISOString(),
    })
  );

  // Link audit: internal links that point at a route we don't publish.
  const known = new Set([
    '/',
    '/blog/',
    '/faqs/',
    '/success-stories/',
    '/sell-house-fast/',
    '/reasons-to-sell/',
    ...TYPES.flatMap((t) => bundle[t].map((i) => i.path)),
    ...(taxonomies.category || []).map((c) => c.path),
  ]);
  const broken = new Map();
  for (const type of TYPES) {
    for (const item of bundle[type]) {
      for (const m of item.content.matchAll(/href="(\/[^"#?]*)"/g)) {
        const href = m[1].endsWith('/') ? m[1] : `${m[1]}/`;
        if (href.startsWith('/media/')) continue;
        if (!known.has(href)) broken.set(href, (broken.get(href) || 0) + 1);
      }
    }
  }
  const brokenSorted = [...broken.entries()].sort((a, b) => b[1] - a[1]);
  await fs.writeFile(
    path.join(OUT, 'broken-links.json'),
    JSON.stringify(Object.fromEntries(brokenSorted), null, 2)
  );

  console.log(
    `\nimages rewritten ${stats.imgRewritten} (${stats.imgMissing} unresolved) · ` +
      `links made relative ${stats.linksRelative} · pages dropped ${stats.dropped}`
  );
  console.log(`unresolved internal link targets: ${brokenSorted.length} distinct -> content/broken-links.json`);
  console.log(brokenSorted.slice(0, 10).map(([p, n]) => `  ${String(n).padStart(4)}  ${p}`).join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
