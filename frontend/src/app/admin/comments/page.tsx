'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminComments, useDeleteAdminComment } from '@/features/admin-comment/hooks';

export default function AdminCommentsPage() {
  const [page, setPage] = useState(0);
  const [movieId, setMovieId] = useState('');
  const [username, setUsername] = useState('');
  const [keyword, setKeyword] = useState('');

  const router = useRouter();

  const allQuery = useAdminComments({
    movieId: movieId.trim() ? Number(movieId) : null,
    username: username.trim() || null,
    keyword: keyword.trim() || null,
    page,
    size: 20
  });

  const deleteCommentMut = useDeleteAdminComment();

  const isLoading = allQuery.isLoading;
  const isError = allQuery.isError;
  const error = allQuery.error as Error | null;

  const allPage = allQuery.data;

  const totalPages = useMemo(() => {
    const p = allPage?.totalPages;
    return Math.max(1, Number(p ?? 1));
  }, [allPage?.totalPages]);

  const currentPage = Math.min(Math.max(0, page), totalPages - 1);

  const goToPage = (next: number) => setPage(Math.min(Math.max(0, next), totalPages - 1));

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý bình luận</h1>
        <p>Xem, tìm kiếm và xóa bình luận của người dùng.</p>
      </header>

      <section className="admin-section">
        <h2 className="admin-section-title">Bộ lọc bình luận</h2>
        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div className="admin-form-field">
            <label className="admin-label">Movie ID</label>
            <input
              className="admin-input"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              placeholder="Ví dụ: 1"
            />
          </div>
          <div className="admin-form-field">
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ví dụ: hieu1"
            />
          </div>
          <div className="admin-form-field">
            <label className="admin-label">Từ khóa</label>
            <input
              className="admin-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nội dung bình luận..."
            />
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách bình luận</h2>
        {isLoading && <p>Đang tải...</p>}
        {isError && <p>Không thể tải: {error?.message}</p>}

        {!isLoading && !isError && allPage?.content?.length === 0 && <p>Chưa có bình luận.</p>}

        {!isLoading && !isError && allPage && allPage.content.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phim</th>
                <th>User</th>
                <th>Nội dung</th>
                <th>Report chưa xử lý</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allPage.content.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    {c.movieTitle} (#{c.movieId})
                  </td>
                  <td>
                    {c.username} (#{c.userId})
                  </td>
                  <td style={{ maxWidth: 520 }}>{c.content}</td>
                  <td>{c.unresolvedReportsCount ?? 0}</td>
                  <td>
                    <div className="admin-table-actions">
                      {Number(c.unresolvedReportsCount ?? 0) > 0 && (
                        <button
                          type="button"
                          className="admin-table-button"
                          onClick={() => router.push('/admin/comment-reports')}
                        >
                          Xử lý report
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-table-button admin-table-button-danger"
                        onClick={() => {
                          if (!window.confirm('Xóa bình luận này?')) return;
                          deleteCommentMut.mutate(c.id);
                        }}
                        disabled={deleteCommentMut.isLoading}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="schedule-pagination" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 0}
            >
              ← Trước
            </button>
            <div className="schedule-page-numbers">
              <button
                type="button"
                className="schedule-page-btn schedule-page-btn-active"
                aria-current="page"
              >
                {currentPage + 1}/{totalPages}
              </button>
            </div>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Sau →
            </button>
          </div>
        )}
      </section>

    </div>
  );
}

