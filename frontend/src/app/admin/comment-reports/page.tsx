'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useDeleteCommentReport,
  useResolveCommentReport,
  useResolvedCommentReports,
  useUnresolvedCommentReports
} from '@/features/admin-comment/hooks';

export default function AdminCommentReportsPage() {
  const [pageUnresolved, setPageUnresolved] = useState(0);
  const [pageResolved, setPageResolved] = useState(0);

  const router = useRouter();

  const unresolvedQuery = useUnresolvedCommentReports(pageUnresolved, 20);
  const resolvedQuery = useResolvedCommentReports(pageResolved, 20);
  const resolveMut = useResolveCommentReport();
  const deleteMut = useDeleteCommentReport();

  const unresolved = unresolvedQuery.data;
  const resolved = resolvedQuery.data;

  const unresolvedTotalPages = useMemo(() => {
    const p = unresolved?.totalPages;
    return Math.max(1, Number(p ?? 1));
  }, [unresolved?.totalPages]);

  const resolvedTotalPages = useMemo(() => {
    const p = resolved?.totalPages;
    return Math.max(1, Number(p ?? 1));
  }, [resolved?.totalPages]);

  const currentUnresolvedPage = Math.min(
    Math.max(0, pageUnresolved),
    unresolvedTotalPages - 1
  );
  const currentResolvedPage = Math.min(Math.max(0, pageResolved), resolvedTotalPages - 1);

  const goToUnresolvedPage = (next: number) =>
    setPageUnresolved(Math.min(Math.max(0, next), unresolvedTotalPages - 1));
  const goToResolvedPage = (next: number) =>
    setPageResolved(Math.min(Math.max(0, next), resolvedTotalPages - 1));

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý report bình luận</h1>
        <p>Xem, xử lý và xóa các báo cáo bình luận của người dùng.</p>
        <button
          type="button"
          className="admin-table-button"
          onClick={() => router.push('/admin/comments')}
          style={{ marginTop: '0.75rem' }}
        >
          ← Trở lại danh sách bình luận
        </button>
      </header>

      <section className="admin-section">
        <h2 className="admin-section-title">Report chưa xử lý</h2>
        {unresolvedQuery.isLoading && <p>Đang tải...</p>}
        {unresolvedQuery.isError && (
          <p>Không thể tải: {(unresolvedQuery.error as Error | null)?.message}</p>
        )}
        {!unresolvedQuery.isLoading &&
          !unresolvedQuery.isError &&
          unresolved?.content?.length === 0 && <p>Hiện chưa có report bình luận nào cần xử lý.</p>}

        {!unresolvedQuery.isLoading &&
          !unresolvedQuery.isError &&
          unresolved &&
          unresolved.content.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID report</th>
                  <th>Bình luận</th>
                  <th>Phim</th>
                  <th>Người bình luận</th>
                  <th>Người báo cáo</th>
                  <th>Lý do</th>
                  <th>Thời gian</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {unresolved.content.map((r) => (
                  <tr key={r.reportId}>
                    <td>{r.reportId}</td>
                    <td style={{ maxWidth: 260 }}>{r.commentContent}</td>
                    <td>
                      {r.movieTitle} (#{r.movieId})
                    </td>
                    <td>
                      {r.commentUsername} (#{r.commentUserId})
                    </td>
                    <td>
                      {r.reporterUsername} (#{r.reporterUserId})
                    </td>
                    <td style={{ maxWidth: 260 }}>{r.reason}</td>
                    <td>{new Date(r.createdAt).toLocaleString('vi-VN')}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-table-button"
                          onClick={() => {
                            if (!window.confirm('Đánh dấu report này là ĐÃ XỬ LÝ?')) return;
                            resolveMut.mutate(r.reportId);
                          }}
                          disabled={resolveMut.isLoading}
                        >
                          Đánh dấu đã xử lý
                        </button>
                        <button
                          type="button"
                          className="admin-table-button admin-table-button-danger"
                          onClick={() => {
                            if (!window.confirm('Xóa report này?')) return;
                            deleteMut.mutate(r.reportId);
                          }}
                          disabled={deleteMut.isLoading}
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

        {unresolvedTotalPages > 1 && (
          <div className="schedule-pagination" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToUnresolvedPage(currentUnresolvedPage - 1)}
              disabled={currentUnresolvedPage <= 0}
            >
              ← Trước
            </button>
            <div className="schedule-page-numbers">
              <button
                type="button"
                className="schedule-page-btn schedule-page-btn-active"
                aria-current="page"
              >
                {currentUnresolvedPage + 1}/{unresolvedTotalPages}
              </button>
            </div>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToUnresolvedPage(currentUnresolvedPage + 1)}
              disabled={currentUnresolvedPage >= unresolvedTotalPages - 1}
            >
              Sau →
            </button>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Report đã xử lý</h2>
        {resolvedQuery.isLoading && <p>Đang tải...</p>}
        {resolvedQuery.isError && (
          <p>Không thể tải: {(resolvedQuery.error as Error | null)?.message}</p>
        )}
        {!resolvedQuery.isLoading &&
          !resolvedQuery.isError &&
          resolved?.content?.length === 0 && <p>Chưa có report nào đã xử lý.</p>}

        {!resolvedQuery.isLoading &&
          !resolvedQuery.isError &&
          resolved &&
          resolved.content.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID report</th>
                  <th>Bình luận</th>
                  <th>Phim</th>
                  <th>Người bình luận</th>
                  <th>Người báo cáo</th>
                  <th>Lý do</th>
                  <th>Thời gian report</th>
                  <th>Đã xử lý lúc</th>
                </tr>
              </thead>
              <tbody>
                {resolved.content.map((r) => (
                  <tr key={r.reportId}>
                    <td>{r.reportId}</td>
                    <td style={{ maxWidth: 260 }}>{r.commentContent}</td>
                    <td>
                      {r.movieTitle} (#{r.movieId})
                    </td>
                    <td>
                      {r.commentUsername} (#{r.commentUserId})
                    </td>
                    <td>
                      {r.reporterUsername} (#{r.reporterUserId})
                    </td>
                    <td style={{ maxWidth: 260 }}>{r.reason}</td>
                    <td>{new Date(r.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{r.resolved ? 'Đã xử lý' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        {resolvedTotalPages > 1 && (
          <div className="schedule-pagination" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToResolvedPage(currentResolvedPage - 1)}
              disabled={currentResolvedPage <= 0}
            >
              ← Trước
            </button>
            <div className="schedule-page-numbers">
              <button
                type="button"
                className="schedule-page-btn schedule-page-btn-active"
                aria-current="page"
              >
                {currentResolvedPage + 1}/{resolvedTotalPages}
              </button>
            </div>
            <button
              type="button"
              className="schedule-page-btn"
              onClick={() => goToResolvedPage(currentResolvedPage + 1)}
              disabled={currentResolvedPage >= resolvedTotalPages - 1}
            >
              Sau →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

