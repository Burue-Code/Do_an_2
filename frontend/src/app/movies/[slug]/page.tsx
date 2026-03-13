'use client';

import { useParams } from 'next/navigation';
import { MovieDetail } from '@/components/movie/movie-detail';
import { useMovieDetail } from '@/features/movie/hooks';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const id = slug ? parseInt(slug, 10) : null;

  const { data: movie, isLoading, isError, error } = useMovieDetail(id);

  if (id == null || isNaN(id)) {
    return <p>ID phim không hợp lệ.</p>;
  }

  if (isLoading) {
    return <p>Đang tải chi tiết phim...</p>;
  }

  if (isError || !movie) {
    return (
      <p>
        Lỗi: {(error as Error)?.message ?? 'Không thể tải thông tin phim'}
      </p>
    );
  }

  return <MovieDetail movie={movie} />;
}
