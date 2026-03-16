const API_BASE =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getPosterUrl(poster: string | null | undefined): string | null {
  if (!poster || typeof poster !== 'string') return null;
  if (poster.startsWith('http://') || poster.startsWith('https://')) {
    return poster;
  }
  return poster.startsWith('/') ? `${API_BASE}${poster}` : `${API_BASE}/${poster}`;
}
