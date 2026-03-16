'use client';

import Link from 'next/link';
import { useMovieEpisodes } from '@/features/movie/hooks';

interface MovieDetailEpisodesProps {
  movieId: number;
  totalEpisodes: number | null;
  movieType: number | null;
}

export function MovieDetailEpisodes({ movieId, totalEpisodes, movieType }: MovieDetailEpisodesProps) {
  const { data: episodes = [] } = useMovieEpisodes(movieId);
  const isSeries = movieType === 2 && (totalEpisodes ?? 0) > 0;
  const hasEpisodes = episodes.length > 0;

  if (!isSeries && !hasEpisodes) return null;

  return (
    <section className="movie-detail-episodes" aria-labelledby="episodes-heading">
      <h2 id="episodes-heading" className="movie-detail-section-title">
        Danh sách tập
      </h2>
      {episodes.length > 0 ? (
        <ul className="movie-detail-episode-list">
          {episodes.map((ep) => (
            <li key={ep.id}>
              <Link href={`/movies/${movieId}/watch?ep=${ep.episodeNumber}`} className="movie-detail-episode-link">
                Tập {ep.episodeNumber}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="movie-detail-episode-empty">
          Tổng {totalEpisodes ?? 0} tập. Chưa có danh sách tập.
        </p>
      )}
    </section>
  );
}
