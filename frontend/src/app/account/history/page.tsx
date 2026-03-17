'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useContinueWatching } from '@/features/continue-watching/hooks';
import { getPosterUrl } from '@/lib/image';

export default function HistoryPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthLoading, isAuthenticated, router]);

  const {
    data: continueData,
    isLoading,
    isError
  } = useContinueWatching({ enabled: mounted && isAuthenticated, limit: 50 });

  if (!mounted) {
    return (
      <div className="account-page">
        <p className="account-section-note">Đang tải...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isAuthLoading) {
    return (
      <div className="account-guard">
        <h1>Bạn cần đăng nhập</h1>
        <p>
          Vui lòng <Link href="/login">đăng nhập</Link> để xem lịch sử xem.
        </p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <div>
          <h1>Lịch sử xem</h1>
          {user && <p className="account-subtitle">Xin chào, {user.fullName || user.username}</p>}
        </div>
      </header>

      <section className="account-section" aria-labelledby="history-heading">
        <div className="account-section-header">
          <h2 id="history-heading">Lịch sử xem gần đây</h2>
        </div>

        {isLoading && <p>Đang tải lịch sử xem...</p>}
        {isError && <p>Không thể tải lịch sử xem. Vui lòng thử lại sau.</p>}

        {!isLoading && !isError && (continueData?.items?.length ?? 0) === 0 && (
          <p>
            Bạn chưa có lịch sử xem. Hãy mở một phim bất kỳ và xem vài phút, hệ thống sẽ lưu lại tại
            đây.
          </p>
        )}

        {!isLoading && !isError && continueData && continueData.items.length > 0 && (
          <div className="account-history-grid">
            {continueData.items.map((item) => {
              const posterUrl = getPosterUrl(item.movie.poster);
              const percent = item.progressPercent ?? 0;
              const seconds =
                item.durationWatchedMinutes && item.durationWatchedMinutes > 0
                  ? item.durationWatchedMinutes
                  : null;
              const href =
                seconds != null
                  ? `/movies/${item.movie.id}/watch?pos=${seconds}`
                  : `/movies/${item.movie.id}/watch`;
              return (
                <Link
                  key={item.movie.id}
                  href={href}
                  className="account-history-card"
                >
                  <div className="account-history-poster">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.movie.title}
                        fill
                        sizes="180px"
                        className="account-history-img"
                        unoptimized
                      />
                    ) : (
                      <div className="account-history-placeholder">No poster</div>
                    )}
                    {percent > 0 && (
                      <div className="account-history-progress">
                        <div
                          className="account-history-progress-fill"
                          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="account-history-info">
                    <span className="account-history-title">{item.movie.title}</span>
                    {percent > 0 && (
                      <span className="account-history-sub">
                        Đã xem khoảng {Math.round(percent)}%
                        {item.episodeNumber ? ` • Tập ${item.episodeNumber}` : ''}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

