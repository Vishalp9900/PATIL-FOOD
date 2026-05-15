/**
 * Reliable food image utility — guarantees every food item ALWAYS shows an image.
 *
 * Strategy:
 *   1. If the food's URL works → use it.
 *   2. If it fails → try a category-based fallback from a curated pool.
 *   3. If even that fails → render a beautiful gradient SVG placeholder with
 *      the food name and an emoji icon (never a broken image icon).
 */

// ===== Curated, verified-working fallback images per category =====
// These Unsplash photo IDs are stable and high-quality.
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
  ],
  pizza: [
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  ],
  indian: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626100134240-b1bb8f2e1131?auto=format&fit=crop&w=800&q=80',
  ],
  asian: [
    'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
  ],
  sandwiches: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=80',
  ],
  sides: [
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=80',
  ],
  salads: [
    'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
  ],
  breakfast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
  ],
  beverages: [
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  ],
  desserts: [
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  ],
};

const CATEGORY_EMOJI: Record<string, string> = {
  burgers: '🍔',
  pizza: '🍕',
  indian: '🍛',
  asian: '🍜',
  sandwiches: '🥪',
  sides: '🍟',
  salads: '🥗',
  breakfast: '🥞',
  beverages: '🥤',
  desserts: '🍰',
};

const CATEGORY_GRADIENT: Record<string, [string, string]> = {
  burgers: ['#fb923c', '#f43f5e'],
  pizza: ['#f59e0b', '#ef4444'],
  indian: ['#f97316', '#dc2626'],
  asian: ['#fbbf24', '#f97316'],
  sandwiches: ['#fcd34d', '#fb923c'],
  sides: ['#fde047', '#f59e0b'],
  salads: ['#86efac', '#22c55e'],
  breakfast: ['#fde68a', '#fb923c'],
  beverages: ['#67e8f9', '#3b82f6'],
  desserts: ['#fda4af', '#ec4899'],
};

/**
 * Returns a usable image URL for the given category.
 * Picks a deterministic fallback so the same item always shows the same image.
 */
export function getCategoryFallback(category: string, seed?: string | number): string {
  const list = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.indian;
  // Deterministic selection based on seed (so it doesn't change on re-render)
  const seedNum = typeof seed === 'number'
    ? seed
    : (seed || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return list[seedNum % list.length];
}

/**
 * Generates a beautiful inline SVG data URI placeholder with food name + emoji.
 * This is the ULTIMATE fallback — it never fails because it's pure inline SVG.
 */
export function getSvgPlaceholder(name: string, category: string): string {
  const emoji = CATEGORY_EMOJI[category] || '🍽️';
  const [c1, c2] = CATEGORY_GRADIENT[category] || ['#f43f5e', '#f97316'];

  // Truncate long names so they fit
  const displayName = name.length > 24 ? name.substring(0, 22) + '…' : name;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="white" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <circle cx="120" cy="120" r="90" fill="white" fill-opacity="0.08"/>
  <circle cx="700" cy="500" r="140" fill="white" fill-opacity="0.06"/>
  <text x="400" y="280" text-anchor="middle" font-size="180" dominant-baseline="middle">${emoji}</text>
  <text x="400" y="430" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="36" font-weight="800" letter-spacing="-1">${escapeXml(displayName)}</text>
  <text x="400" y="470" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="system-ui,sans-serif" font-size="18" font-weight="600" letter-spacing="3">PATIL FOODS</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Master fallback handler for <img onError={...}>.
 * Tries category fallback first, then SVG placeholder.
 *
 * Usage:
 *   <img src={item.image} onError={handleImageError(item.name, item.category, item.id)} />
 */
export function handleImageError(name: string, category: string, seed?: string | number) {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const currentSrc = target.src;
    const fallback = getCategoryFallback(category, seed);

    // Step 1: try category fallback (only if not already using it)
    if (!currentSrc.includes(fallback.split('?')[0]) && !currentSrc.startsWith('data:')) {
      target.src = fallback;
      // If the fallback ALSO fails, swap to the SVG placeholder
      target.onerror = () => {
        target.onerror = null;
        target.src = getSvgPlaceholder(name, category);
      };
      return;
    }

    // Step 2: ultimate SVG fallback
    target.onerror = null;
    target.src = getSvgPlaceholder(name, category);
  };
}

/**
 * Returns a guaranteed-good image URL for an item — used for a NEW
 * food item that the admin saved without an image URL.
 */
export function ensureFoodImage(image: string | undefined, category: string, name: string, seed?: string | number): string {
  if (image && image.trim() !== '' && (image.startsWith('http') || image.startsWith('data:'))) {
    return image;
  }
  // Admin saved item without image → give it a category fallback
  return getCategoryFallback(category, seed || name);
}
