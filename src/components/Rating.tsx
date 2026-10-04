import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingDisplayProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export function RatingDisplay({ rating, size = 16, showNumber = true }: RatingDisplayProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <Star className="text-amber-500 fill-amber-500" style={{ width: size, height: size }} />
      {showNumber && (
        <span className="font-bold text-ink-800" style={{ fontSize: size * 0.9 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 48 }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          className="transition-transform active:scale-90 hover:scale-110"
          aria-label={`${star} зірок`}
        >
          <Star
            style={{ width: size, height: size }}
            className={
              star <= (hover || value)
                ? 'text-amber-500 fill-amber-500'
                : 'text-ink-200 fill-ink-200'
            }
          />
        </button>
      ))}
    </div>
  );
}
