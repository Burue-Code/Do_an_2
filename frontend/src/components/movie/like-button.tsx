'use client';

import { useState } from 'react';
import { useToggleLike } from '@/features/like/hooks';
import { useAuth } from '@/hooks/use-auth';

interface LikeButtonProps {
  movieId: number;
}

export function LikeButton({ movieId }: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useToggleLike(movieId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Bạn cần đăng nhập để thích phim.');
      return;
    }
    if (mutation.isPending) return;

    setErrorMessage(null);

    try {
      const result = await mutation.mutateAsync();
      setLiked(result.liked);
    } catch {
      setErrorMessage('Không thể cập nhật trạng thái thích. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="movie-like-wrapper">
      <button
        type="button"
        className={`movie-like-button ${liked ? 'movie-like-button-liked' : ''}`}
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-pressed={liked}
        aria-label={liked ? 'Bỏ thích phim' : 'Thích phim'}
      >
        <span className="movie-like-icon">{liked ? '❤' : '♡'}</span>
        <span className="movie-like-label">{liked ? 'Đã thích' : 'Thích'}</span>
      </button>
      {errorMessage && <p className="movie-like-error">{errorMessage}</p>}
    </div>
  );
}

