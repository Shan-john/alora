/**
 * Format price in INR
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

/**
 * Format date
 */
export function formatDate(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

/**
 * Generate slug from text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Truncate text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Calculate discount percentage
 */
export function discountPercent(original, sale) {
  if (!original || !sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}
