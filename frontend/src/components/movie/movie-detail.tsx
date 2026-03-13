import Image from 'next/image';
import { getPosterUrl } from '@/lib/image';
import type { MovieDetail as MovieDetailType } from '@/features/movie/types';

interface MovieDetailProps {
  movie: MovieDetailType;
}

function formatRating(score: number) {
  return score.toFixed(1);
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const posterUrl = getPosterUrl(movie.poster);

  return (
    <article className="movie-detail">
      <div className="movie-detail-hero">
        <div className="movie-detail-poster">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              width={320}
              height={480}
              className="movie-detail-poster-img"
              unoptimized
              priority
            />
          ) : (
            <div className="movie-detail-poster-placeholder">No poster</div>
          )}
        </div>
        <div className="movie-detail-meta">
          <h1 className="movie-detail-title">{movie.title}</h1>
          <div className="movie-detail-rating-row">
            <span className="movie-detail-rating">
              {formatRating(movie.ratingScore ?? 0)} ★
            </span>
            {movie.ratingCount != null && movie.ratingCount > 0 && (
              <span className="movie-detail-count">
                ({movie.ratingCount} đánh giá)
              </span>
            )}
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-detail-genres">
              {movie.genres.map((g) => (
                <span key={g} className="movie-detail-genre-tag">
                  {g}
                </span>
              ))}
            </div>
          )}
          <div className="movie-detail-misc">
            {movie.releaseYear != null && (
              <span>Năm: {movie.releaseYear}</span>
            )}
            {movie.duration != null && (
              <span>Thời lượng: {movie.duration} phút</span>
            )}
            {movie.status != null && <span>Trạng thái: {movie.status}</span>}
          </div>
          {movie.description && (
            <p className="movie-detail-description">{movie.description}</p>
          )}
        </div>
      </div>

      <section className="movie-detail-comments">
        <h2 className="movie-detail-section-title">Bình luận</h2>
        <p className="movie-detail-comments-placeholder">
          Phần bình luận sẽ được cập nhật sau.
        </p>
      </section>
    </article>
  );
}
