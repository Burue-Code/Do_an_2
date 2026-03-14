'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MovieDetail } from '@/components/movie/movie-detail';
import { useMovieDetail } from '@/features/movie/hooks';

function DetailSkeleton() {
  return (
    <div className="movie-detail-skeleton">
      <Link href="/movies" className="movie-detail-back">
        ← Quay lại danh sách phim
      </Link>
      <div className="movie-detail-skeleton-hero">
        <div className="movie-detail-skeleton-poster" />
        <div className="movie-detail-skeleton-meta">
          <div className="movie-detail-skeleton-line movie-detail-skeleton-title" />
          <div className="movie-detail-skeleton-line movie-detail-skeleton-rating" />
          <div className="movie-detail-skeleton-lines">
            <div className="movie-detail-skeleton-line" />
            <div className="movie-detail-skeleton-line" />
            <div className="movie-detail-skeleton-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="movie-detail-error">
      <h2 className="movie-detail-error-title">Không thể tải thông tin phim</h2>
      <p className="movie-detail-error-message">{message}</p>
      <Link href="/movies" className="movie-detail-back-btn">
        Quay lại danh sách phim
      </Link>
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const id = slug ? parseInt(slug, 10) : null;

  const { data: movie, isLoading, isError, error } = useMovieDetail(id);

  if (id == null || isNaN(id)) {
    return (
      <ErrorState message="ID phim không hợp lệ. Vui lòng kiểm tra đường dẫn." />
    );
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !movie) {
    const message =
      (error as Error)?.message ??
      (isError && !movie ? 'Phim không tồn tại hoặc đã bị xóa.' : 'Không thể tải thông tin phim.');
    return <ErrorState message={message} />;
  }

  return (
    <div className="movie-detail-page">
      <Link href="/movies" className="movie-detail-back">
        ← Quay lại danh sách phim
      </Link>
      <MovieDetail movie={movie} />
    </div>
  );
}
