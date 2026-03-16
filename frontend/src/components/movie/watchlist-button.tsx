'use client';

import { useState } from 'react';
import { useWatchlistStatus, useToggleWatchlist } from '@/features/watchlist/hooks';
import { useAuth } from '@/hooks/use-auth';

interface WatchlistButtonProps {
  movieId: number;
}

export function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: status } = useWatchlistStatus(movieId);
  const mutation = useToggleWatchlist(movieId);

  const inWatchlist = status?.inWatchlist ?? false;

  const handleClick = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Bạn cần đăng nhập để theo dõi phim.');
      return;
    }
    if (mutation.isPending) return;

    setErrorMessage(null);

    try {
      await mutation.mutateAsync();
    } catch {
      setErrorMessage('Không thể cập nhật danh sách theo dõi. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="movie-watchlist-wrapper">
      <button
        type="button"
        className={`movie-watchlist-button ${inWatchlist ? 'movie-watchlist-button-active' : ''}`}
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-pressed={inWatchlist}
        aria-label={inWatchlist ? 'Bỏ theo dõi' : 'Theo dõi phim'}
      >
        <span className="movie-watchlist-icon">{inWatchlist ? '✓' : '+'}</span>
        <span className="movie-watchlist-label">{inWatchlist ? 'Đã theo dõi' : 'Theo dõi'}</span>
      </button>
      {errorMessage && <p className="movie-watchlist-error">{errorMessage}</p>}
    </div>
  );
}
