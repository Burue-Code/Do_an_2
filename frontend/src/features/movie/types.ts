export interface MovieCard {
  id: number;
  title: string;
  poster: string | null;
  ratingScore: number;
  ratingCount: number;
  status?: string | null;
  movieType?: number | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  description: string | null;
  releaseYear: number | null;
  createdAt?: string | null;
  poster: string | null;
  duration: number | null;
  status: string | null;
  totalEpisodes: number | null;
  ratingScore: number;
  ratingCount: number;
  movieType: number | null;
  genres: string[];
}

export interface MoviePageResponse {
  content: MovieCard[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
