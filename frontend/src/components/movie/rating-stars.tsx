'use client';

import { useState } from 'react';
import { useRateMovie } from '@/features/rating/hooks';
import { useAuth } from '@/hooks/use-auth';

interface RatingStarsProps {
  movieId: number;
  initialScore: number;
  initialCount: number;
}

const MAX_STARS = 5;

function formatRating(score: number) {
  return score.toFixed(1);
}

export function RatingStars({ movieId, initialScore, initialCount }: RatingStarsProps) {
  const { isAuthenticated } = useAuth();
  const [score, setScore] = useState(initialScore);
  const [count, setCount] = useState(initialCount);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useRateMovie(movieId);

  const currentDisplayValue = hoverValue ?? score;

  const handleClick = async (value: number) => {
    if (!isAuthenticated) {
      setErrorMessage('Bạn cần đăng nhập để đánh giá phim.');
      return;
    }
    if (mutation.isPending) return;

    setErrorMessage(null);

    try {
      const summary = await mutation.mutateAsync(value);
      setScore(summary.ratingScore ?? 0);
      setCount(summary.ratingCount ?? 0);
    } catch {
      setErrorMessage('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  return (
    <div
      className="movie-detail-rating-row"
      aria-label={`Điểm đánh giá: ${formatRating(score)} trên ${MAX_STARS}`}
    >
      <div className="movie-rating-stars">
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const value = index + 1;
          const isActive = value <= Math.round(currentDisplayValue);

          return (
            <button
              key={value}
              type="button"
              className={`movie-rating-star ${isActive ? 'movie-rating-star-active' : ''}`}
              onMouseEnter={() => setHoverValue(value)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={() => handleClick(value)}
              disabled={mutation.isPending}
              aria-label={`Đánh giá ${value} trên ${MAX_STARS} sao`}
            >
              ★
            </button>
          );
        })}
      </div>
      <div className="movie-rating-meta">
        <span className="movie-detail-rating">{formatRating(score)} ★</span>
        {count > 0 && (
          <span className="movie-detail-count">{count} đánh giá</span>
        )}
        {errorMessage && (
          <span className="movie-rating-error">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}

