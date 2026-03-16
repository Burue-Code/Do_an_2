import Image from 'next/image';
import Link from 'next/link';
import { getPosterUrl } from '@/lib/image';
import type { MovieCard as MovieCardType } from '@/features/movie/types';

interface MovieCardProps {
  movie: MovieCardType;
}

function formatRating(score: number) {
  return score.toFixed(1);
}

export function MovieCard({ movie }: MovieCardProps) {
  const href = `/movies/${movie.id}`;
  const posterUrl = getPosterUrl(movie.poster);

  return (
    <Link href={href} className="movie-card">
      <div className="movie-card-poster">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="movie-card-poster-img"
            unoptimized
          />
        ) : (
          <div className="movie-card-poster-placeholder">
            <span>No poster</span>
          </div>
        )}
        <span className="movie-card-rating">
          {formatRating(movie.ratingScore ?? 0)} ★
        </span>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        {movie.ratingCount != null && movie.ratingCount > 0 && (
          <span className="movie-card-count">{movie.ratingCount} đánh giá</span>
        )}
      </div>
    </Link>
  );
}
