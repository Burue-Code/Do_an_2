'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMyWatchlist } from '@/features/watchlist/hooks';
import { MovieGrid } from '@/components/movie/movie-grid';

export default function WatchlistPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const { data, isLoading, isError, error } = useMyWatchlist({ page: 0, size: 20 });

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
          {user && <p className="account-subtitle">Xin chào, {user.fullName || user.username}</p>}
        </div>
      </header>

      <section id="danh-sach-theo-doi" className="account-section" aria-labelledby="watchlist-heading">
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

