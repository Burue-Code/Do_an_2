'use client';

import { useParams, useRouter } from 'next/navigation';
import { MovieDetail } from '@/components/movie/movie-detail';
import { useMovieDetail } from '@/features/movie/hooks';

function DetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="movie-detail-skeleton">
      <button type="button" className="movie-detail-back" onClick={onBack}>
        ← Quay lại danh sách phim
      </button>
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

function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="movie-detail-error">
      <h2 className="movie-detail-error-title">Không thể tải thông tin phim</h2>
      <p className="movie-detail-error-message">{message}</p>
      <button type="button" className="movie-detail-back-btn" onClick={onBack}>
        Quay lại danh sách phim
      </button>
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/movies');
    }
  };

  const slug = params?.slug as string | undefined;
  const id = slug ? parseInt(slug, 10) : null;

  const { data: movie, isLoading, isError, error } = useMovieDetail(id);

  if (id == null || isNaN(id)) {
    return (
      <ErrorState
        message="ID phim không hợp lệ. Vui lòng kiểm tra đường dẫn."
        onBack={handleBack}
      />
    );
  }

  if (isLoading) {
    return <DetailSkeleton onBack={handleBack} />;
  }

  if (isError || !movie) {
    const message =
      (error as Error)?.message ??
      (isError && !movie ? 'Phim không tồn tại hoặc đã bị xóa.' : 'Không thể tải thông tin phim.');
    return <ErrorState message={message} onBack={handleBack} />;
  }

  return (
    <div className="movie-detail-page">
      <button type="button" className="movie-detail-back" onClick={handleBack}>
        ← Quay lại danh sách phim
      </button>
      <MovieDetail movie={movie} />
    </div>
  );
}
