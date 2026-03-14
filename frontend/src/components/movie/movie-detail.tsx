import Image from 'next/image';
import { getPosterUrl } from '@/lib/image';
import type { MovieDetail as MovieDetailType } from '@/features/movie/types';
import { CommentList } from './comment-list';
import { RatingStars } from './rating-stars';
import { LikeButton } from './like-button';

interface MovieDetailProps {
  movie: MovieDetailType;
}

function formatRating(score: number) {
  return score.toFixed(1);
}

/** movieType: 0 = Phim lẻ, 1 = Phim bộ (hoặc theo enum backend) */
function getMovieTypeLabel(movieType: number | null | undefined): string | null {
  if (movieType == null) return null;
  if (movieType === 0) return 'Phim lẻ';
  if (movieType === 1) return 'Phim bộ';
  return `Loại ${movieType}`;
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const posterUrl = getPosterUrl(movie.poster);
  const movieTypeLabel = getMovieTypeLabel(movie.movieType);

  return (
    <article className="movie-detail" aria-label={`Chi tiết phim: ${movie.title}`}>
      <div className="movie-detail-hero">
        <div className="movie-detail-poster">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Poster: ${movie.title}`}
              width={320}
              height={480}
              className="movie-detail-poster-img"
              unoptimized
              priority
              sizes="(max-width: 640px) 100vw, 320px"
            />
          ) : (
            <div className="movie-detail-poster-placeholder" aria-hidden="true">
              <span>Chưa có poster</span>
            </div>
          )}
        </div>
        <div className="movie-detail-meta">
          {movieTypeLabel && (
            <span className="movie-detail-type-badge">{movieTypeLabel}</span>
          )}
          <div className="movie-detail-title-row">
            <h1 className="movie-detail-title">{movie.title}</h1>
            <LikeButton movieId={movie.id} />
          </div>
          <RatingStars
            movieId={movie.id}
            initialScore={movie.ratingScore ?? 0}
            initialCount={movie.ratingCount ?? 0}
          />
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-detail-genres" aria-label="Thể loại">
              {movie.genres.map((g) => (
                <span key={g} className="movie-detail-genre-tag">
                  {g}
                </span>
              ))}
            </div>
          )}
          <dl className="movie-detail-misc">
            {movie.releaseYear != null && (
              <div className="movie-detail-misc-item">
                <dt>Năm phát hành</dt>
                <dd>{movie.releaseYear}</dd>
              </div>
            )}
            {movie.duration != null && (
              <div className="movie-detail-misc-item">
                <dt>Thời lượng</dt>
                <dd>{movie.duration} phút</dd>
              </div>
            )}
            {movie.totalEpisodes != null && movie.totalEpisodes > 0 && (
              <div className="movie-detail-misc-item">
                <dt>Số tập</dt>
                <dd>{movie.totalEpisodes} tập</dd>
              </div>
            )}
            {movie.status != null && (
              <div className="movie-detail-misc-item">
                <dt>Trạng thái</dt>
                <dd>{movie.status}</dd>
              </div>
            )}
          </dl>
          {movie.description && (
            <section className="movie-detail-description-wrap" aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="movie-detail-section-title movie-detail-section-title-small">
                Nội dung
              </h2>
              <p className="movie-detail-description">{movie.description}</p>
            </section>
          )}
        </div>
      </div>

      <section className="movie-detail-comments" aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="movie-detail-section-title">
          Bình luận
        </h2>
        <CommentList movieId={movie.id} />
      </section>
    </article>
  );
}
