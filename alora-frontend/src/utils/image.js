const UNSPLASH_PHOTO_ID_REGEX = /([A-Za-z0-9_-]{11})$/;

export function normalizeImageUrl(url, options = {}) {
  if (!url) return '';

  const { width = 1600, height = 1600 } = options;
  const raw = String(url).trim();
  if (!raw) return '';

  let candidate = raw;
  if (!/^https?:\/\//i.test(candidate) && candidate.startsWith('unsplash.com/')) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.endsWith('unsplash.com') && parsed.pathname.includes('/photos/')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      const photoIndex = segments.indexOf('photos');
      const photoSegment = photoIndex >= 0 ? segments[photoIndex + 1] : '';
      const match = (photoSegment || '').match(UNSPLASH_PHOTO_ID_REGEX);

      if (match?.[1]) {
        return `https://source.unsplash.com/${match[1]}/${width}x${height}`;
      }
    }

    return candidate;
  } catch {
    return raw;
  }
}
