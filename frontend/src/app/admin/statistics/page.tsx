'use client';

import { useDashboardOverview, useGenreStatistics, useTrendingMovies } from '@/features/admin-dashboard/hooks';

export default function AdminStatisticsPage() {
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError, error: overviewError } =
    useDashboardOverview();
  const {
    data: trending,
    isLoading: isTrendingLoading,
    isError: isTrendingError,
    error: trendingError
  } = useTrendingMovies(10);
  const {
    data: genres,
    isLoading: isGenresLoading,
    isError: isGenresError,
    error: genresError
  } = useGenreStatistics();

  const isLoading = isOverviewLoading || isTrendingLoading || isGenresLoading;
  const isError = isOverviewError || isTrendingError || isGenresError;
  const firstError = (overviewError || trendingError || genresError) as Error | undefined;

  return (
    <div>
      <header className="admin-page-header">
        <h1>Thống kê hệ thống</h1>
        <p>
          Tổng quan về người dùng, nội dung và mức độ tương tác giúp bạn theo dõi sức khỏe hệ thống.
        </p>
      </header>

      {isLoading && <p>Đang tải thống kê...</p>}

      {isError && (
        <p>
          Không thể tải thống kê.{' '}
          {firstError?.message ?? 'Vui lòng kiểm tra lại kết nối và backend (dashboard API).}
        </p>
      )}

      {!isLoading && !isError && overview && (
        <section className="admin-section">
          <h2 className="admin-section-title">Tổng quan</h2>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <p className="admin-stat-label">Người dùng</p>
              <p className="admin-stat-value">{overview.totalUsers}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Phim</p>
              <p className="admin-stat-value">{overview.totalMovies}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Bình luận</p>
              <p className="admin-stat-value">{overview.totalComments}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Đánh giá</p>
              <p className="admin-stat-value">{overview.totalRatings}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Lượt thích</p>
              <p className="admin-stat-value">{overview.totalLikes}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Watchlist items</p>
              <p className="admin-stat-value">{overview.totalWatchlistItems}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Watch logs</p>
              <p className="admin-stat-value">{overview.totalWatchLogs}</p>
            </div>
          </div>
        </section>
      )}

      {!isLoading && !isError && trending && trending.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-section-title">Phim đang thịnh hành</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Lượt xem (30 ngày)</th>
                <th>Điểm rating</th>
                <th>Số lượt đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {trending.map((m) => (
                <tr key={m.movieId}>
                  <td>{m.title}</td>
                  <td>
                    <div className="admin-stat-bar-row">
                      <span>{m.watchCountRecent}</span>
                    </div>
                  </td>
                  <td>{m.ratingScore?.toFixed(1) ?? '-'}</td>
                  <td>{m.ratingCount ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {!isLoading && !isError && genres && genres.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-section-title">Phân bố phim theo thể loại</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thể loại</th>
                <th>Số phim</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g.genreId}>
                  <td>{g.genreName}</td>
                  <td>
                    <div className="admin-stat-bar-row">
                      <span>{g.movieCount}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

