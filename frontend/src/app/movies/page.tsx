'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieGrid } from '@/components/movie/movie-grid';
import { useMovieList } from '@/features/movie/hooks';
import { useGenres } from '@/features/genre/hooks';
import styles from './movies.module.css';

const MENU_LABELS: Record<string, string> = {
  'phim-le': 'Phim lẻ',
  'phim-bo': 'Phim bộ',
  'phim-moi': 'Phim mới cập nhật',
  'top-phim': 'Top phim (đánh giá cao)'
};

/** 1 = phim lẻ, 2 = phim bộ (backend movie_type) */
const MENU_TO_MOVIE_TYPE: Record<string, number> = {
  'phim-le': 1,
  'phim-bo': 2
};

const MENU_TO_SORT: Record<string, 'top' | 'new'> = {
  'phim-moi': 'new',
  'top-phim': 'top'
};

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get('keyword') ?? '';
  const genreIdFromUrl = searchParams.get('genreId');
  const menuFromUrl = searchParams.get('menu') ?? '';
  const [page, setPage] = useState(0);

  // Reset page when filters change (genre, keyword, menu)
  const filterKey = `${genreIdFromUrl ?? ''}-${keywordFromUrl}-${menuFromUrl}`;
  useEffect(() => {
    setPage(0);
  }, [filterKey]);

  const { data: genres = [] } = useGenres();
  const movieType = menuFromUrl && MENU_TO_MOVIE_TYPE[menuFromUrl] != null ? MENU_TO_MOVIE_TYPE[menuFromUrl] : undefined;
  const sort = menuFromUrl && MENU_TO_SORT[menuFromUrl] ? MENU_TO_SORT[menuFromUrl] : undefined;
  const listParams = {
    page,
    size: 20,
    keyword: keywordFromUrl || undefined,
    genreId: genreIdFromUrl ? Number(genreIdFromUrl) : undefined,
    movieType,
    sort
  };
  const { data, isLoading, isError, error } = useMovieList(listParams);

  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  const genreName = genreIdFromUrl && genres.length
    ? genres.find((g) => g.id === Number(genreIdFromUrl))?.name
    : null;
  const selectionText =
    genreName != null
      ? `Thể loại: ${genreName}`
      : keywordFromUrl
        ? `Tìm kiếm: "${keywordFromUrl}"`
        : menuFromUrl && MENU_LABELS[menuFromUrl]
          ? MENU_LABELS[menuFromUrl]
          : 'Tất cả phim';

  return (
    <div key={filterKey}>
      <p className={styles.selectionBar} aria-live="polite">
        {selectionText}
      </p>
      {isLoading && <p className="movies-page-loading">Đang tải...</p>}
      {isError && (
        <div className="movies-page-error-box">
          <p className="movies-page-error">
            {(error as Error)?.message === 'Network Error'
              ? 'Không kết nối được máy chủ. Hãy chạy backend (Spring Boot) tại http://localhost:8080 rồi tải lại trang.'
              : `Lỗi: ${(error as Error)?.message ?? 'Không thể tải dữ liệu'}`}
          </p>
        </div>
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
