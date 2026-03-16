'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateMovie, useActorSuggestions, useDirectorSuggestions } from '@/features/admin-movie/hooks';
import { useGenres } from '@/features/genre/hooks';

export default function AdminCreateMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createMovie = useCreateMovie();
  const actorSuggestionsApi = useActorSuggestions();
  const directorSuggestionsApi = useDirectorSuggestions();
  const { data: genres = [] } = useGenres();

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [status, setStatus] = useState('');
  const [totalEpisodes, setTotalEpisodes] = useState<string>('');
  const [movieType, setMovieType] = useState<number | undefined>(undefined);
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [actorQuery, setActorQuery] = useState('');
  const [directorQuery, setDirectorQuery] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<api.SimplePerson[]>([]);
  const [directorSuggestions, setDirectorSuggestions] = useState<api.SimplePerson[]>([]);
  const [selectedActorIds, setSelectedActorIds] = useState<number[]>([]);
  const [selectedActors, setSelectedActors] = useState<api.SimplePerson[]>([]);
  const [selectedDirectorIds, setSelectedDirectorIds] = useState<number[]>([]);
  const [selectedDirectors, setSelectedDirectors] = useState<api.SimplePerson[]>([]);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    const mt = searchParams.get('movieType');
    if (mt === '1' || mt === '2') {
      setMovieType(Number(mt));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    if (!title.trim()) return;

    const releaseYear =
      releaseDate && !Number.isNaN(Date.parse(releaseDate))
        ? new Date(releaseDate).getFullYear()
        : null;

    try {
      await createMovie.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        releaseYear,
        duration: duration ? Number(duration) : null,
        status: status.trim() || null,
        totalEpisodes: totalEpisodes ? Number(totalEpisodes) : null,
        movieType: movieType ?? null,
        poster: poster.trim() || null,
        genreIds: selectedGenreIds.length ? selectedGenreIds : null,
        actorIds: selectedActorIds.length ? selectedActorIds : null,
        directorIds: selectedDirectorIds.length ? selectedDirectorIds : null
      });

      setSubmitMessage('Đã lưu phim thành công.');
    } catch {
      setSubmitMessage('Không thể lưu phim. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1>Thêm phim mới</h1>
        <p>Nhập thông tin phim và lưu lại để thêm vào hệ thống.</p>
      </header>

      <section className="admin-section">
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="admin-input"
            placeholder="Tiêu đề phim"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="admin-input"
            value={movieType ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setMovieType(v === '' ? undefined : Number(v));
            }}
          >
            <option value="">Chọn loại phim (tùy chọn)</option>
            <option value="1">Phim lẻ</option>
            <option value="2">Phim bộ</option>
          </select>
          <input
            type="date"
            className="admin-input"
            placeholder="Năm phát hành"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <input
            type="number"
            className="admin-input"
            placeholder="Thời lượng (phút)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <select
            className="admin-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Chọn trạng thái (tùy chọn)</option>
            <option value="Đang chiếu">Đang chiếu</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
          <input
            type="number"
            className="admin-input"
            placeholder="Số tập (nếu phim bộ)"
            value={totalEpisodes}
            onChange={(e) => setTotalEpisodes(e.target.value)}
          />
          <input
            type="text"
            className="admin-input"
            placeholder="URL poster (tùy chọn)"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
          />
          <div style={{ flex: '1 1 100%' }}>
            <label className="account-profile-label">Thể loại</label>
            <div className="account-genres-wrap">
              {genres.map((g) => (
                <label key={g.id} className="account-genre-chip">
                  <input
                    type="checkbox"
                    checked={selectedGenreIds.includes(Number(g.id))}
                    onChange={() =>
                      setSelectedGenreIds((prev) =>
                        prev.includes(Number(g.id))
                          ? prev.filter((id) => id !== Number(g.id))
                          : [...prev, Number(g.id)]
                      )
                    }
                  />
                  <span>{g.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', flex: '1 1 100%' }}>
            <label className="account-profile-label">Đạo diễn</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Gõ để tìm đạo diễn"
              value={directorQuery}
              onChange={async (e) => {
                const value = e.target.value;
                setDirectorQuery(value);
                setDirectorSuggestions(await directorSuggestionsApi.search(value));
              }}
            />
            {directorSuggestions.length > 0 && (
              <ul className="admin-suggestions" role="listbox">
                {directorSuggestions.map((d) => (
                  <li key={d.id} role="option">
                    <button
                      type="button"
                      className="admin-suggestion-item"
                      onClick={() => {
                        if (!selectedDirectorIds.includes(d.id)) {
                          setSelectedDirectorIds((prev) => [...prev, d.id]);
                          setSelectedDirectors((prev) => [...prev, d]);
                        }
                        // Hiển thị tên đã chọn lên ô text
                        setDirectorQuery(d.fullName);
                        setDirectorSuggestions([]);
                      }}
                    >
                      {d.fullName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ position: 'relative', flex: '1 1 100%' }}>
            <label className="account-profile-label">Diễn viên</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Gõ để tìm diễn viên"
              value={actorQuery}
              onChange={async (e) => {
                const value = e.target.value;
                setActorQuery(value);
                setActorSuggestions(await actorSuggestionsApi.search(value));
              }}
            />
            {actorSuggestions.length > 0 && (
              <ul className="admin-suggestions" role="listbox">
                {actorSuggestions.map((a) => (
                  <li key={a.id} role="option">
                    <button
                      type="button"
                      className="admin-suggestion-item"
                      onClick={() => {
                        if (!selectedActorIds.includes(a.id)) {
                          setSelectedActorIds((prev) => [...prev, a.id]);
                          setSelectedActors((prev) => [...prev, a]);
                        }
                        // Thêm vào danh sách và reset ô tìm kiếm để chọn tiếp
                        setActorQuery('');
                        setActorSuggestions([]);
                      }}
                    >
                      {a.fullName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedActors.length > 0 && (
              <div className="account-genres-wrap" style={{ marginTop: '0.5rem' }}>
                {selectedActors.map((actor) => (
                  <span key={actor.id} className="account-genre-chip">
                    <span>{actor.fullName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedActorIds((prev) => prev.filter((id) => id !== actor.id));
                        setSelectedActors((prev) => prev.filter((a) => a.id !== actor.id));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.8rem'
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <textarea
            className="admin-input"
            placeholder="Mô tả (tùy chọn)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: '1 1 100%' }}
          />
          <div className="admin-form-actions">
            <button
              type="submit"
              className="auth-button-primary"
              disabled={createMovie.isPending}
            >
              Lưu phim
            </button>
            <button
              type="button"
              className="auth-button-secondary"
              onClick={() => router.push('/admin/movies')}
            >
              Hủy
            </button>
          </div>
          {submitMessage && (
            <p className="account-profile-message" style={{ marginTop: '0.5rem' }}>
              {submitMessage}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

