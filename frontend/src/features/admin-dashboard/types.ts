export interface DashboardOverview {
  totalUsers: number;
  totalMovies: number;
  totalComments: number;
  totalRatings: number;
  totalLikes: number;
  totalWatchlistItems: number;
  totalWatchLogs: number;
}

export interface TrendingMovie {
  movieId: number;
  title: string;
  poster: string | null;
  ratingScore: number | null;
  ratingCount: number | null;
  watchCountRecent: number;
}

export interface GenreStatistic {
  genreId: number;
  genreName: string;
  movieCount: number;
}

