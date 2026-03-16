'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useRecommendationsHome } from '@/features/recommendation/hooks';
import { useContinueWatching } from '@/features/continue-watching/hooks';
import { useTrending, useTop, useNewReleases, useMovieList } from '@/features/movie/hooks';
import { useGenres } from '@/features/genre/hooks';
import { getPosterUrl } from '@/lib/image';
import styles from './home.module.css';

type HeroMovie = { id: number; title: string; poster: string | null; description?: string | null };

function HeroCarousel({ movies }: { movies: HeroMovie[] }) {
  const [index, setIndex] = useState(0);
  const current = movies[index];

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % movies.length), 5000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (!current) return null;

  const goPrev = () => setIndex((i) => (i - 1 + movies.length) % movies.length);
  const goNext = () => setIndex((i) => (i + 1) % movies.length);
  const bgUrl = getPosterUrl(current.poster) || '';

  return (
    <section className={styles.hero} aria-label="Banner phim nổi bật">
      <div className={styles.heroBg}>
        {bgUrl && (
          <Image src={bgUrl} alt="" fill className={styles.heroBgImg} priority unoptimized key={current.id} />
        )}
        <div className={styles.heroOverlay} />
        {movies.length > 1 && (
          <>
            <button
              type="button"
              className={styles.heroNav}
              onClick={goPrev}
              aria-label="Phim trước"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.heroNav} ${styles.heroNavRight}`}
              onClick={goNext}
              aria-label="Phim sau"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{current.title}</h1>
        {current.description && (
          <p className={styles.heroDesc}>
            {current.description.slice(0, 200)}{current.description.length > 200 ? '...' : ''}
          </p>
        )}
        <div className={styles.heroActions}>
          <Link href={`/movies/${current.id}/watch`} className={styles.heroBtnPrimary}>
            Xem ngay
          </Link>
          <Link href={`/movies/${current.id}`} className={styles.heroBtnSecondary}>
            Thêm vào danh sách
          </Link>
        </div>
        {movies.length > 1 && (
          <div className={styles.heroDots} role="tablist" aria-label="Chọn phim banner">
            {movies.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Phim ${i + 1}: ${m.title}`}
                className={i === index ? styles.heroDotActive : styles.heroDot}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SectionTitle({ title, id }: { title: string; id?: string }) {
  return (
    <h2 className={styles.sectionTitle} id={id}>
      {title}
    </h2>
  );
}

function HorizontalMovieList({ movies, baseUrl = '/movies', size = 'default' }: { movies: { id: number; title: string; poster: string | null; ratingScore?: number; ratingCount?: number }[]; baseUrl?: string; size?: 'default' | 'large' }) {
  if (!movies?.length) return null;
  const listClass = size === 'large' ? `${styles.horizontalList} ${styles.horizontalListLarge}` : styles.horizontalList;
  const cardClass = size === 'large' ? `${styles.horizontalCard} ${styles.horizontalCardLarge} ${styles.horizontalCardFeatured}` : styles.horizontalCard;
  return (
    <div className={listClass}>
      {movies.map((m) => {
        const posterUrl = getPosterUrl(m.poster);
        const ratingCount = m.ratingCount ?? 0;
        return (
          <Link key={m.id} href={`${baseUrl}/${m.id}`} className={cardClass}>
            <div className={styles.horizontalCardPoster}>
              {posterUrl ? (
                <Image src={posterUrl} alt={m.title} fill sizes={size === 'large' ? '240px' : '180px'} className={styles.horizontalCardImg} unoptimized />
              ) : (
                <div className={styles.horizontalCardPlaceholder}>No poster</div>
              )}
              {m.ratingScore != null && (
                <span className={size === 'large' ? `${styles.horizontalCardRating} ${styles.horizontalCardRatingFeatured}` : styles.horizontalCardRating}>
                  {Number(m.ratingScore).toFixed(1)} ★
                </span>
              )}
            </div>
            <div className={size === 'large' ? styles.horizontalCardInfo : undefined}>
              <span className={styles.horizontalCardTitle}>{m.title}</span>
              {size === 'large' && <span className={styles.horizontalCardReviews}>{ratingCount} đánh giá</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ContinueWatchingSection() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useContinueWatching({ enabled: isAuthenticated, limit: 8 });
  const items = data?.items ?? [];

  if (!isAuthenticated) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="Tiếp tục xem" />
      {isLoading && <p className={styles.sectionEmpty}>Đang tải...</p>}
      {isError && (
        <p className={styles.sectionEmpty}>Không tải được danh sách. Thử tải lại trang.</p>
      )}
      {!isLoading && !isError && items.length > 0 && (
        <div className={styles.horizontalList}>
          {items.map((item) => {
            const seconds =
              item.durationWatchedMinutes && item.durationWatchedMinutes > 0
                ? item.durationWatchedMinutes
                : null;
            const href =
              seconds != null
                ? `/movies/${item.movie.id}/watch?pos=${seconds}`
                : `/movies/${item.movie.id}/watch`;
            return (
              <Link key={item.movie.id} href={href} className={styles.horizontalCard}>
              <div className={styles.horizontalCardPoster}>
                {getPosterUrl(item.movie.poster) ? (
                  <Image
                    src={getPosterUrl(item.movie.poster)!}
                    alt={item.movie.title}
                    fill
                    sizes="180px"
                    className={styles.horizontalCardImg}
                    unoptimized
                  />
                ) : (
                  <div className={styles.horizontalCardPlaceholder}>No poster</div>
                )}
                {item.progressPercent != null && item.progressPercent > 0 && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${item.progressPercent}%` }} />
                  </div>
                )}
                <span className={styles.horizontalCardRating}>{Number(item.movie.ratingScore ?? 0).toFixed(1)} ★</span>
              </div>
              <span className={styles.horizontalCardTitle}>{item.movie.title}</span>
              {item.progressPercent != null && <span className={styles.progressLabel}>{item.progressPercent}%</span>}
            </Link>
            );
          })}
        </div>
      )}
      {!isLoading && !isError && items.length === 0 && (
        <p className={styles.sectionEmpty}>
          Bạn chưa xem phim nào. <Link href="/movies" className={styles.inlineLink}>Khám phá phim</Link> và bắt đầu xem.
        </p>
      )}
    </section>
  );
}

const HASH_LABELS: Record<string, string> = {
  'phim-moi': 'Phim mới cập nhật',
  'top-phim': 'Top bảng xếp hạng',
  'the-loai': 'Theo thể loại'
};

function useSectionFromHash() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
      setLabel(hash && HASH_LABELS[hash] ? HASH_LABELS[hash] : null);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  return label;
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const sectionLabel = useSectionFromHash();
  const { data: recData, isLoading: recLoading, isError: recError } = useRecommendationsHome(20);
  const { data: trendingData, isLoading: trendingLoading } = useTrending(10);
  const { data: topData, isLoading: topLoading } = useTop(10);
  const { data: newData } = useNewReleases(10);
  const { data: genres } = useGenres();
  const { data: firstPageMovies } = useMovieList({ size: 1 });

  const heroMovies: HeroMovie[] = (() => {
    const seen = new Set<number>();
    const list: HeroMovie[] = [];
    const add = (m: { id: number; title: string; poster: string | null } | undefined) => {
      if (m && !seen.has(m.id)) {
        seen.add(m.id);
        list.push({ id: m.id, title: m.title, poster: m.poster });
      }
    };
    recData?.items?.slice(0, 4).forEach((i) => add(i.movie));
    trendingData?.slice(0, 3).forEach(add);
    topData?.slice(0, 3).forEach(add);
    newData?.slice(0, 3).forEach(add);
    firstPageMovies?.content?.slice(0, 2).forEach(add);
    return list;
  })();

  return (
    <div className={styles.root}>
      {sectionLabel && (
        <p className={styles.selectionBar} aria-live="polite">
          Đang xem: {sectionLabel}
        </p>
      )}
      {heroMovies.length > 0 ? (
        <HeroCarousel movies={heroMovies} />
      ) : (
        <section className={`${styles.hero} ${styles.heroPlaceholder}`} aria-label="Banner phim nổi bật">
          <div className={styles.heroBg}>
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Khám phá phim hay</h1>
            <p className={styles.heroDesc}>Xem và lưu danh sách phim yêu thích của bạn.</p>
            <div className={styles.heroActions}>
              <Link href="/movies" className={styles.heroBtnPrimary}>
                Xem danh sách phim
              </Link>
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && (
        <section className={styles.section}>
          <SectionTitle title="Dành cho bạn" />
          {recError && (
            <p className={styles.sectionEmpty}>
              Không tải được gợi ý. Bạn có thể <Link href="/movies" className={styles.inlineLink}>khám phá phim</Link>.
            </p>
          )}
          {!recError && (() => {
            const recItems = recData?.items ?? [];
            const fallbackMovies = (trendingData ?? topData ?? []).slice(0, 12);
            const moviesToShow = recItems.length > 0
              ? recItems.slice(0, 12).map((item) => item.movie)
              : fallbackMovies;
            const waitingForFallback = recItems.length === 0 && (trendingLoading || topLoading);
            if ((recLoading || waitingForFallback) && moviesToShow.length === 0) {
              return <p className={styles.sectionEmpty}>Đang tải gợi ý...</p>;
            }
            if (moviesToShow.length === 0) {
              return (
                <p className={styles.sectionEmpty}>
                  Chưa có gợi ý. <Link href="/movies" className={styles.inlineLink}>Khám phá phim</Link> để nhận gợi ý.
                </p>
              );
            }
            return <HorizontalMovieList movies={moviesToShow} size="large" />;
          })()}
        </section>
      )}

      <ContinueWatchingSection />

      {(trendingData?.length ?? 0) > 0 && (
        <section className={styles.section}>
          <SectionTitle title="Phim thịnh hành" />
          <HorizontalMovieList movies={trendingData!} size="large" />
        </section>
      )}

      {(topData?.length ?? 0) > 0 && (
        <section className={styles.section} id="top-phim">
          <SectionTitle title="Top bảng xếp hạng" />
          <HorizontalMovieList movies={topData!} size="large" />
        </section>
      )}

      {(newData?.length ?? 0) > 0 && (
        <section className={styles.section} id="phim-moi">
          <SectionTitle title="Phim mới cập nhật" />
          <HorizontalMovieList movies={newData!} size="large" />
        </section>
      )}

      {genres && genres.length > 0 && (
        <section className={styles.section} id="the-loai">
          <SectionTitle title="Theo thể loại" />
          {genres.slice(0, 6).map((genre) => (
            <GenreRow key={genre.id} genreId={genre.id} genreName={genre.name} />
          ))}
        </section>
      )}
    </div>
  );
}

function GenreRow({ genreId, genreName }: { genreId: number; genreName: string }) {
  const { data } = useMovieList({ genreId, size: 12 });
  const movies = data?.content ?? [];
  if (movies.length === 0) return null;
  return (
    <div className={styles.genreRow}>
      <h3 className={styles.genreRowTitle}>{genreName}</h3>
      <HorizontalMovieList movies={movies} />
    </div>
  );
}
