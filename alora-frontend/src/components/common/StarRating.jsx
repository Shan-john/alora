import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 16, showCount = false, count = 0 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={size} className="fill-gold text-gold" />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className="relative" style={{ width: size, height: size }}>
          <Star size={size} className="text-stone-300 absolute" />
          <div className="overflow-hidden absolute" style={{ width: size / 2 }}>
            <Star size={size} className="fill-gold text-gold" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-stone-300" />
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {showCount && count > 0 && (
        <span className="ml-1 text-xs text-stone-500">({count})</span>
      )}
    </div>
  );
}
