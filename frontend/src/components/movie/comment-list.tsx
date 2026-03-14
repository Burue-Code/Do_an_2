'use client';

import { useState } from 'react';
import { useComments, useCreateComment } from '@/features/comment/hooks';
import { useAuth } from '@/hooks/use-auth';

interface CommentListProps {
  movieId: number;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function CommentList({ movieId }: CommentListProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');

  const {
    data,
    isLoading,
    isError,
    error
  } = useComments(movieId, 0, 20);

  const createMutation = useCreateComment(movieId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || createMutation.isPending) return;

    try {
      await createMutation.mutateAsync({ content: trimmed });
      setContent('');
    } catch {
      // error handled in UI
    }
  };

  const comments = data?.content ?? [];

  return (
    <div className="movie-comments-root">
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="movie-comment-form">
          <div className="movie-comment-form-header">
            <span className="movie-comment-avatar" aria-hidden="true">
              {user?.fullName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <div className="movie-comment-user-meta">
              <span className="movie-comment-user-name">
                {user?.fullName ?? user?.username ?? 'Bạn'}
              </span>
              <span className="movie-comment-user-hint">Chia sẻ cảm nhận về phim này</span>
            </div>
          </div>
          <textarea
            className="movie-comment-textarea"
            placeholder="Viết bình luận của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="movie-comment-actions">
            {createMutation.isError && (
              <p className="movie-comment-error">
                Không thể gửi bình luận. Vui lòng thử lại sau.
              </p>
            )}
            <button
              type="submit"
              className="auth-button-primary movie-comment-submit"
              disabled={!content.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </form>
      ) : (
        <div className="movie-comment-login-hint">
          <p>
            Bạn cần{' '}
            <a href="/login" className="movie-comment-link">
              đăng nhập
            </a>{' '}
            để bình luận về phim.
          </p>
        </div>
      )}

      <div className="movie-comment-list">
        {isLoading && <p className="movie-comment-muted">Đang tải bình luận...</p>}
        {isError && (
          <p className="movie-comment-error">
            {(error as Error)?.message ?? 'Không thể tải danh sách bình luận.'}
          </p>
        )}
        {!isLoading && !isError && comments.length === 0 && (
          <p className="movie-comment-muted">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        )}
        {!isLoading &&
          !isError &&
          comments.map((comment) => (
            <article key={comment.id} className="movie-comment-item">
              <div className="movie-comment-item-header">
                <div className="movie-comment-item-avatar" aria-hidden="true">
                  {comment.username?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="movie-comment-item-meta">
                  <span className="movie-comment-item-author">{comment.username}</span>
                  <span className="movie-comment-item-time">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>
              </div>
              <p className="movie-comment-item-content">{comment.content}</p>
            </article>
          ))}
      </div>
    </div>
  );
}

