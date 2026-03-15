'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useMovieDetail, useMovieEpisodes, useMovieCast, useTrending, useTop } from '@/features/movie/hooks';
import { useRecommendationsHome } from '@/features/recommendation/hooks';
import { VideoPlayer } from '@/components/watch/video-player';
import { CommentList } from '@/components/movie/comment-list';
import { RatingStars } from '@/components/movie/rating-stars';
import { LikeButton } from '@/components/movie/like-button';
import { WatchlistButton } from '@/components/movie/watchlist-button';
import { getPosterUrl } from '@/lib/image';
import styles from './watch.module.css';

function getMovieTypeLabel(movieType: number | null | undefined): string {
  if (movieType == null) return '';
  if (movieType === 1) return 'Phim lẻ';
  if (movieType === 2) return 'Phim bộ';
  return `Loại ${movieType}`;
}

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string | undefined;
  const id = slug ? parseInt(slug, 10) : null;
  const epParam = searchParams?.get('ep');

  const { data: movie, isLoading, isError } = useMovieDetail(id);
  const { data: episodes = [] } = useMovieEpisodes(id);
  const { data: cast, isLoading: castLoading } = useMovieCast(id);
  const { data: trendingData } = useTrending(8);
  const { data: topData } = useTop(8);
  const { data: recData } = useRecommendationsHome(12);

  if (id == null || isNaN(id)) {
    return (
      <div className={styles.wrap}>
        <p>ID phim không hợp lệ.</p>
        <Link href="/movies">← Quay lại danh sách phim</Link>
      </div>
    );
  }

  if (isLoading || !movie) {
    return (
      <div className={styles.wrap}>
        <div className={styles.playerSkeleton} />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.wrap}>
        <p>Không thể tải phim.</p>
        <Link href="/movies">← Quay lại danh sách phim</Link>
      </div>
    );
  }

  const posterUrl = getPosterUrl(movie.poster);
  const epNum = epParam ? parseInt(epParam, 10) : null;
  const currentEpisode = epNum != null && !isNaN(epNum) ? episodes.find((e) => e.episodeNumber === epNum) : null;
  const videoSrc =
    currentEpisode?.videoUrl ?? (episodes.length > 0 ? episodes[0].videoUrl : null) ?? '/videos/sample.mp4';
  const fromRec = (recData?.items?.map((i) => i.movie) ?? []).filter((m) => m.id !== movie.id).slice(0, 6);
  const trending = (trendingData ?? []).filter((m) => m.id !== movie.id).slice(0, 8);
  const top = (topData ?? []).filter((m) => m.id !== movie.id).slice(0, 8);
  const relatedMovies = fromRec.length > 0 ? fromRec : (trending.length ? trending : top).slice(0, 6);
  const sidebarList = trending.length ? trending : top;
  const relatedToShow = relatedMovies.length > 0 ? relatedMovies : sidebarList.slice(0, 6);
  const isSeries = movie.movieType === 2 && (movie.totalEpisodes ?? 0) > 0;
  const hasEpisodes = episodes.length > 0;
  const actors = cast?.actors ?? [];
  const directors = cast?.directors ?? [];

  const watchTitleText =
    movie.movieType === 2 && (epNum != null || episodes.length > 0)
      ? `${movie.title} - Tập ${epNum ?? currentEpisode?.episodeNumber ?? episodes[0]?.episodeNumber ?? 1}`
      : movie.movieType === 1
        ? `${movie.title} (Phim lẻ)`
        : movie.title;

  return (
    <div className={styles.wrap}>
      <Link href={`/movies/${movie.id}`} className={styles.backLink}>
        ← Chi tiết phim
      </Link>

      <section className={styles.main}>
        <div className={styles.playerSection}>
          <h1 className={styles.watchTitle}>{watchTitleText}</h1>
          <VideoPlayer src={videoSrc} poster={posterUrl || movie.poster} title={movie.title} />
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.mainCol}>
            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Thông tin phim</h2>
              <div className={styles.infoRow}>
                {posterUrl && (
                  <div className={styles.posterWrap}>
                    <Image src={posterUrl} alt="" width={160} height={240} className={styles.poster} unoptimized />
                  </div>
                )}
                <div className={styles.infoMeta}>
                  <p className={styles.description}>{movie.description || 'Chưa có mô tả.'}</p>
                  <dl className={styles.metaList}>
                    <dt>Thể loại</dt>
                    <dd>{movie.genres?.length ? movie.genres.join(', ') : '—'}</dd>
                    <dt>Năm phát hành</dt>
                    <dd>{movie.releaseYear ?? '—'}</dd>
                    <dt>Thời lượng</dt>
                    <dd>{movie.duration != null ? `${movie.duration} phút` : movie.totalEpisodes != null ? `${movie.totalEpisodes} tập` : '—'}</dd>
                    <dt>Điểm đánh giá</dt>
                    <dd>{(movie.ratingScore ?? 0).toFixed(1)} ★ ({movie.ratingCount ?? 0} lượt)</dd>
                    <dt>Trạng thái</dt>
                    <dd>{movie.status || getMovieTypeLabel(movie.movieType) || '—'}</dd>
                  </dl>
                </div>
              </div>
            </section>

            <section className={styles.castSection}>
              <h2 className={styles.sectionTitle}>Thông tin tham gia</h2>
              {castLoading ? (
                <p className={styles.placeholderText}>Đang tải...</p>
              ) : (actors.length > 0 || directors.length > 0) ? (
                <div className={styles.castContent}>
                  {actors.length > 0 && (
                    <div className={styles.castBlock}>
                      <h3 className={styles.castSubtitle}>Diễn viên</h3>
                      <ul className={styles.castList}>
                        {actors.map((a) => (
                          <li key={a.id}>
                            <strong>{a.fullName}</strong>
                            {a.characterName ? <span className={styles.castRole}> — {a.characterName}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {directors.length > 0 && (
                    <div className={styles.castBlock}>
                      <h3 className={styles.castSubtitle}>Đạo diễn</h3>
                      <ul className={styles.castList}>
                        {directors.map((d) => (
                          <li key={d.id}>{d.fullName}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className={styles.placeholderText}>Chưa có thông tin diễn viên, đạo diễn.</p>
              )}
            </section>

            <section className={styles.interactSection}>
              <h2 className={styles.sectionTitle}>Tương tác</h2>
              <div className={styles.interactRow}>
                <WatchlistButton movieId={movie.id} />
                <LikeButton movieId={movie.id} />
                <RatingStars movieId={movie.id} initialScore={movie.ratingScore ?? 0} initialCount={movie.ratingCount ?? 0} />
                <button type="button" className={styles.shareBtn} onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  Chia sẻ
                </button>
              </div>
            </section>

            <section className={styles.commentsSection}>
              <h2 className={styles.sectionTitle}>Bình luận</h2>
              <CommentList movieId={movie.id} />
            </section>

            {(isSeries || hasEpisodes) && (
              <section className={styles.episodesSection}>
                <h2 className={styles.sectionTitle}>Danh sách tập</h2>
                {episodes.length > 0 ? (
                  <ul className={styles.episodeList}>
                    {episodes.map((ep) => (
                      <li key={ep.id}>
                        <Link href={`/movies/${movie.id}/watch?ep=${ep.episodeNumber}`} className={styles.episodeLink}>
                          Tập {ep.episodeNumber}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.placeholderText}>Tổng {movie.totalEpisodes ?? 0} tập. Chưa có danh sách tập.</p>
                )}
              </section>
            )}

            <section className={styles.relatedSection}>
              <h2 className={styles.sectionTitle}>Phim đề xuất</h2>
              <div className={styles.relatedScroll}>
                {relatedToShow.length > 0 ? (
                  relatedToShow.map((m) => (
                    <Link key={m.id} href={`/movies/${m.id}/watch`} className={styles.relatedCard}>
                      <div className={styles.relatedPosterWrap}>
                        {getPosterUrl(m.poster) ? (
                          <Image src={getPosterUrl(m.poster)!} alt="" fill sizes="160px" className={styles.relatedPoster} unoptimized />
                        ) : (
                          <div className={styles.relatedPlaceholder} />
                        )}
                        <span className={styles.relatedRating}>{(m.ratingScore ?? 0).toFixed(1)} ★</span>
                      </div>
                      <span className={styles.relatedTitle} title={m.title}>{m.title}</span>
                    </Link>
                  ))
                ) : (
                  <p className={styles.placeholderText}>Chưa có phim đề xuất. Đăng nhập hoặc kiểm tra kết nối API.</p>
                )}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Top / Thịnh hành</h3>
            <ul className={styles.sidebarList}>
              {sidebarList.map((m, i) => (
                <li key={m.id}>
                  <Link href={`/movies/${m.id}/watch`} className={styles.sidebarItem}>
                    <span className={styles.sidebarNum}>{i + 1}</span>
                    <span className={styles.sidebarName}>{m.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
