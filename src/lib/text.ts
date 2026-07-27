/** Text helpers shared by server and client components (no fs access). */

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Trim plain text to a word budget, the way wp_trim_words did. */
export function trimWords(text: string, words: number): string {
  const parts = text.trim().split(/\s+/);
  return parts.length <= words ? text.trim() : `${parts.slice(0, words).join(' ')}…`;
}

/** Strip tags so HTML content can be used as an excerpt or meta description. */
export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
