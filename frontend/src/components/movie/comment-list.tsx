'use client';

import { useState } from 'react';
import { useComments, useCreateComment, useReportComment } from '@/features/comment/hooks';
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
  const reportMutation = useReportComment();

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

  const handleReport = async (commentId: number) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const presets = [
      'Nội dung xúc phạm / thô tục',
      'Spam / quảng cáo',
      'Nội dung không liên quan tới phim',
      'Chứa thông tin nhạy cảm / spoil quá nhiều',
      'Khác (tự nhập lý do...)'
    ];

    const menu =
      'Chọn lý do báo cáo (nhập số 1–5 hoặc tự nhập lý do):\n' +
      presets.map((r, i) => `${i + 1}. ${r}`).join('\n');

    let input = window.prompt(menu);
    if (!input) return;

    input = input.trim();

    let reason: string;
    const num = Number(input);
    if (Number.isInteger(num) && num >= 1 && num <= presets.length) {
      reason = presets[num - 1];
      if (num === presets.length) {
        const custom = window.prompt('Nhập lý do chi tiết:');
        const trimmedCustom = custom?.trim();
        if (!trimmedCustom) return;
        reason = trimmedCustom;
      }
    } else {
      reason = input;
    }

    if (!reason || reportMutation.isPending) return;

    try {
      await reportMutation.mutateAsync({ commentId, reason });
      alert('Đã gửi báo cáo bình luận.');
    } catch {
      alert('Không thể gửi báo cáo. Vui lòng thử lại sau.');
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
              <button
                type="button"
                className="movie-comment-report-button"
                onClick={() => handleReport(comment.id)}
                disabled={reportMutation.isPending}
              >
                Báo cáo
              </button>
            </article>
          ))}
      </div>
    </div>
  );
}

