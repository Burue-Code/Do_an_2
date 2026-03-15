'use client';

import Link from 'next/link';
import { MovieGrid } from '@/components/movie/movie-grid';
import { useRecommendationsHome } from '@/features/recommendation/hooks';

export default function RecommendationsPage() {
  const { data, isLoading, isError, error } = useRecommendationsHome(20);

  const items = data?.items ?? [];

  return (
    <div className="recommendations-page">
      <header className="recommendations-header">
        <h1>Gợi ý cho bạn</h1>
        <p className="recommendations-subtitle">
          Danh sách phim được đề xuất dựa trên thể loại yêu thích, lịch sử xem, lượt thích và
          đánh giá.
        </p>
      </header>

      {isLoading && <p className="movies-page-loading">Đang tải gợi ý phim...</p>}

      {isError && (
        <div className="movies-page-error-box">
          <p className="movies-page-error">
            {(error as Error)?.message === 'Network Error'
              ? 'Không kết nối được máy chủ. Hãy chạy backend (Spring Boot) tại http://localhost:8080 rồi tải lại trang.'
              : `Lỗi: ${(error as Error)?.message ?? 'Không thể tải gợi ý phim'}`}
          </p>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="recommendations-empty">
          <p>Hiện chưa có gợi ý phù hợp cho bạn.</p>
          <p>
            Hãy khám phá thêm tại{' '}
            <Link href="/movies" className="recommendations-link">
              trang danh sách phim
            </Link>{' '}
            để hệ thống hiểu sở thích của bạn hơn.
          </p>
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <section aria-label="Danh sách phim được gợi ý" className="recommendations-grid-wrap">
          <MovieGrid movies={items.map((item) => item.movie)} />
        </section>
      )}
    </div>
  );
}

