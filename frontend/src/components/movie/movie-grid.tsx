import { MovieCard } from './movie-card';
import type { MovieCard as MovieCardType } from '@/features/movie/types';

interface MovieGridProps {
  movies: MovieCardType[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>Không tìm thấy phim nào.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
