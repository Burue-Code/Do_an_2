'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMyWatchlist } from '@/features/watchlist/hooks';
import { useContinueWatching } from '@/features/continue-watching/hooks';
import { ContinueWatchingCard } from '@/components/movie/continue-watching-card';
import { MovieGrid } from '@/components/movie/movie-grid';

export default function WatchlistPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const { data, isLoading, isError, error } = useMyWatchlist({ page: 0, size: 20 });
  const {
    data: continueData,
    isLoading: isContinueLoading,
    isError: isContinueError
  } = useContinueWatching();

  if (!isAuthenticated && !isAuthLoading) {
    return (
      <div className="account-guard">
        <h1>Bạn cần đăng nhập</h1>
        <p>
          Vui lòng <Link href="/login">đăng nhập</Link> để xem danh sách phim theo dõi.
        </p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <div>
          <h1>Danh sách theo dõi</h1>
          {user && <p className="account-subtitle">Xin chào, {user.username}</p>}
        </div>
      </header>

      <section className="account-section" aria-labelledby="continue-watching-heading">
        <div className="account-section-header">
          <h2 id="continue-watching-heading">Tiếp tục xem</h2>
        </div>
        {isContinueLoading && <p>Đang tải danh sách tiếp tục xem...</p>}
        {isContinueError && <p>Không thể tải danh sách tiếp tục xem.</p>}
        {continueData && continueData.items.length === 0 && (
          <p>Không có phim nào đang xem dở.</p>
        )}
        {continueData && continueData.items.length > 0 && (
          <div className="continue-grid">
            {continueData.items.map((item) => (
              <ContinueWatchingCard key={`${item.id}-${item.episodeNumber ?? 0}`} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="account-section" aria-labelledby="watchlist-heading">
        <div className="account-section-header">
          <h2 id="watchlist-heading">Danh sách theo dõi</h2>
        </div>

        {isLoading && <p>Đang tải danh sách theo dõi...</p>}
        {isError && <p>Không thể tải danh sách theo dõi. {(error as Error)?.message}</p>}

        {data && data.content.length === 0 && (
          <p>
            Bạn chưa theo dõi phim nào. Hãy vào trang{' '}
            <Link href="/movies">Danh sách phim</Link> để thêm vào watchlist.
          </p>
        )}

        {data && data.content.length > 0 && (
          <section aria-label="Danh sách phim theo dõi">
            <MovieGrid movies={data.content} />
          </section>
        )}
      </section>
    </div>
  );
}

