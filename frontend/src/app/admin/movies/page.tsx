'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMovieList } from '@/features/movie/hooks';
import { useGenres } from '@/features/genre/hooks';
import { useDeleteMovie } from '@/features/admin-movie/hooks';

export default function AdminMoviesPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [movieType, setMovieType] = useState<number | undefined>(undefined);
  const [genreId, setGenreId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: genres = [] } = useGenres();
  const deleteMovie = useDeleteMovie();
  const { data, isLoading, isError, error } = useMovieList({
    page,
    size: 20,
    keyword: keyword.trim() || undefined,
    movieType,
    genreId
  });

  const movies = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSubmitFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý phim</h1>
        <p>Xem, xóa phim và lọc theo từ khóa, thể loại và loại phim. Thêm phim mới ở trang riêng.</p>
      </header>

      <section className="admin-section">
        <h2 className="admin-section-title">Bộ lọc</h2>
        <form className="admin-form" onSubmit={handleSubmitFilter}>
          <input
            type="text"
            placeholder="Tìm theo tên phim..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="admin-input"
          />
          <select
            className="admin-input"
            value={movieType ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setMovieType(v === '' ? undefined : Number(v));
              setPage(0);
            }}
          >
            <option value="">Tất cả loại phim</option>
            <option value="1">Phim lẻ</option>
            <option value="2">Phim bộ</option>
          </select>
          <select
            className="admin-input"
            value={genreId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setGenreId(v === '' ? undefined : Number(v));
              setPage(0);
            }}
          >
            <option value="">Tất cả thể loại</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <div className="admin-form-actions">
            <button
              type="button"
              className="auth-button-primary"
              onClick={() => {
                const mt = movieType;
                const query = mt ? `?movieType=${mt}` : '';
                router.push(`/admin/movies/new${query}`);
              }}
            >
              Thêm phim mới
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách phim</h2>
        {isLoading && <p>Đang tải danh sách phim...</p>}
        {isError && (
          <p>
            Không thể tải danh sách phim.{' '}
            {(error as Error)?.message ?? 'Vui lòng kiểm tra kết nối và backend.'}
          </p>
        )}
        {!isLoading && !isError && (
          <>
            {movies.length === 0 ? (
              <p>Không có phim nào phù hợp với bộ lọc hiện tại.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Loại</th>
                    <th>Năm</th>
                    <th>Điểm</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.title}</td>
                      <td>{m.movieType === 2 ? 'Phim bộ' : 'Phim lẻ'}</td>
                      <td>{m.releaseYear ?? '-'}</td>
                      <td>{m.ratingScore?.toFixed?.(1) ?? '-'}</td>
                      <td className="admin-table-actions">
                        <Link href={`/admin/movies/${m.id}`} className="admin-table-button">
                          Xem chi tiết
                        </Link>
                        <button
                          type="button"
                          className="admin-table-button admin-table-button-danger"
                          onClick={() => deleteMovie.mutate(m.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {totalPages > 1 && (
              <div className="admin-form-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="admin-table-button"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trang trước
                </button>
                <span>
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="admin-table-button"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}


