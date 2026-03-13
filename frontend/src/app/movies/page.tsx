'use client';

import { useState } from 'react';
import { MovieGrid } from '@/components/movie/movie-grid';
import { useMovieList } from '@/features/movie/hooks';
import { useGenres } from '@/features/genre/hooks';

export default function MoviesPage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [genreId, setGenreId] = useState<number | ''>('');
  const [keywordInput, setKeywordInput] = useState('');

  const { data, isLoading, isError, error } = useMovieList({
    page,
    size: 20,
    keyword: keyword || undefined,
    genreId: genreId === '' ? undefined : (genreId as number)
  });
  const { data: genres } = useGenres();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(0);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGenreId(val === '' ? '' : Number(val));
    setPage(0);
  };

  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  return (
    <div>
      <header className="movies-page-header">
        <h1>Danh sách phim</h1>
        <form onSubmit={handleSearch} className="movies-page-filters">
          <input
            type="text"
            placeholder="Tìm theo tên phim..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="movies-page-input"
          />
          <button type="submit" className="auth-button-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            Tìm kiếm
          </button>
          <select
            value={genreId}
            onChange={handleGenreChange}
            className="movies-page-select"
          >
            <option value="">Tất cả thể loại</option>
            {genres?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </form>
      </header>

      {isLoading && <p className="movies-page-loading">Đang tải...</p>}
      {isError && (
        <p className="movies-page-error">
          Lỗi: {(error as Error)?.message ?? 'Không thể tải dữ liệu'}
        </p>
      )}
      {!isLoading && !isError && data && (
        <>
          <MovieGrid movies={data.content} />
          {totalPages > 1 && (
            <nav className="movies-page-pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage <= 0}
              >
                Trước
              </button>
              <span>
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Sau
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
