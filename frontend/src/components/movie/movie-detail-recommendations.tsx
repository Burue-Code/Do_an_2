'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTrending, useTop } from '@/features/movie/hooks';
import { useRecommendationsHome } from '@/features/recommendation/hooks';
import { getPosterUrl } from '@/lib/image';

interface MovieDetailRecommendationsProps {
  currentMovieId: number;
}

export function MovieDetailRecommendations({ currentMovieId }: MovieDetailRecommendationsProps) {
  const { data: recData } = useRecommendationsHome(12);
  const { data: trendingData } = useTrending(8);
  const { data: topData } = useTop(8);

  const fromRec = (recData?.items?.map((i) => i.movie) ?? []).filter((m) => m.id !== currentMovieId).slice(0, 6);
  const trending = (trendingData ?? []).filter((m) => m.id !== currentMovieId).slice(0, 8);
  const top = (topData ?? []).filter((m) => m.id !== currentMovieId).slice(0, 8);
  const relatedMovies = fromRec.length > 0 ? fromRec : (trending.length ? trending : top).slice(0, 6);

  if (relatedMovies.length === 0) return null;

  return (
    <section className="movie-detail-recommendations" aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading" className="movie-detail-section-title">
        Phim đề xuất
      </h2>
      <div className="movie-detail-recommendations-scroll">
        {relatedMovies.map((m) => (
          <Link key={m.id} href={`/movies/${m.id}/watch`} className="movie-detail-recommendations-card">
            <div className="movie-detail-recommendations-poster-wrap">
              {getPosterUrl(m.poster) ? (
                <Image
                  src={getPosterUrl(m.poster)!}
                  alt=""
                  fill
                  sizes="160px"
                  className="movie-detail-recommendations-poster"
                  unoptimized
                />
              ) : (
                <div className="movie-detail-recommendations-placeholder" />
              )}
              <span className="movie-detail-recommendations-rating">{(m.ratingScore ?? 0).toFixed(1)} ★</span>
            </div>
            <span className="movie-detail-recommendations-title" title={m.title}>
              {m.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
