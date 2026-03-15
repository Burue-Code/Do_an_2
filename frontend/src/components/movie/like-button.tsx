'use client';

import { useState } from 'react';
import { useLikeStatus, useToggleLike } from '@/features/like/hooks';
import { useAuth } from '@/hooks/use-auth';

interface LikeButtonProps {
  movieId: number;
}

export function LikeButton({ movieId }: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: likeStatus } = useLikeStatus(movieId, isAuthenticated);
  const mutation = useToggleLike(movieId);

  /* Chưa đăng nhập luôn hiển thị "Thích", không dùng cache/API */
  const liked = isAuthenticated && (likeStatus?.liked ?? false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Bạn cần đăng nhập để thích phim.');
      return;
    }
    if (mutation.isPending) return;

    setErrorMessage(null);

    try {
      await mutation.mutateAsync();
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

