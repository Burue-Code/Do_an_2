'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MovieDetail } from '@/components/movie/movie-detail';
import { useMovieDetail, useMovieCast, useMovieEpisodes } from '@/features/movie/hooks';
import {
  useAdminMovieStats,
  useUpdateMovie,
  useActorSuggestions,
  useDirectorSuggestions,
  useAdminEpisodes,
  useCreateEpisode,
  useUpdateEpisode,
  useDeleteEpisode,
  useSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule
} from '@/features/admin-movie/hooks';
import type { MovieDetail as MovieDetailType } from '@/features/movie/types';
import { useGenres } from '@/features/genre/hooks';

function AdminDetailSkeleton() {
  return (
    <div className="movie-detail-skeleton">
      <Link href="/admin/movies" className="movie-detail-back">
        ← Quay lại danh sách phim (admin)
      </Link>
      <div className="movie-detail-skeleton-hero">
        <div className="movie-detail-skeleton-poster" />
        <div className="movie-detail-skeleton-meta">
          <div className="movie-detail-skeleton-line movie-detail-skeleton-title" />
          <div className="movie-detail-skeleton-line movie-detail-skeleton-rating" />
          <div className="movie-detail-skeleton-lines">
            <div className="movie-detail-skeleton-line" />
            <div className="movie-detail-skeleton-line" />
            <div className="movie-detail-skeleton-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminErrorState({ message }: { message: string }) {
  return (
    <div className="movie-detail-error">
      <h2 className="movie-detail-error-title">Không thể tải thông tin phim (admin)</h2>
      <p className="movie-detail-error-message">{message}</p>
      <Link href="/admin/movies" className="movie-detail-back-btn">
        Quay lại danh sách phim (admin)
      </Link>
    </div>
  );
}

export default function AdminMovieDetailPage() {
  const params = useParams();
  const rawId = params?.id as string | undefined;
  const id = rawId ? parseInt(rawId, 10) : null;

  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
    error: movieError
  } = useMovieDetail(id);
  const {
    data: cast,
    isLoading: isCastLoading,
    isError: isCastError
  } = useMovieCast(id);
  const {
    data: publicEpisodes,
    isLoading: isEpisodesLoading,
    isError: isEpisodesError
  } = useMovieEpisodes(id, movie?.movieType === 2);
  const {
    data: adminEpisodes,
    isLoading: isAdminEpisodesLoading,
    isError: isAdminEpisodesError
  } = useAdminEpisodes(id);
  const {
    data: schedules,
    isLoading: isSchedulesLoading,
    isError: isSchedulesError
  } = useSchedules(id);

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError
  } = useAdminMovieStats(id);
  const { data: allGenres = [] } = useGenres();

  const updateMovieMutation = useUpdateMovie();
  const actorSuggestionsApi = useActorSuggestions();
  const directorSuggestionsApi = useDirectorSuggestions();
  const createEpisodeMutation = useCreateEpisode();
  const updateEpisodeMutation = useUpdateEpisode();
  const deleteEpisodeMutation = useDeleteEpisode();
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [status, setStatus] = useState('');
  const [movieType, setMovieType] = useState<string>('');
  const [totalEpisodes, setTotalEpisodes] = useState<string>('');
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedActorIds, setSelectedActorIds] = useState<number[]>([]);
  const [selectedDirectorIds, setSelectedDirectorIds] = useState<number[]>([]);
  const [actorQuery, setActorQuery] = useState('');
  const [directorQuery, setDirectorQuery] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<{ id: number; fullName: string }[]>([]);
  const [directorSuggestions, setDirectorSuggestions] = useState<{ id: number; fullName: string }[]>([]);
  const [addedDirectorNames, setAddedDirectorNames] = useState<Record<number, string>>({});
  const [addedActorNames, setAddedActorNames] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  const [episodeNumber, setEpisodeNumber] = useState<string>('');
  const [episodeVideoUrl, setEpisodeVideoUrl] = useState('');
  const [episodeReleaseTime, setEpisodeReleaseTime] = useState('');
  const [editingEpisodeId, setEditingEpisodeId] = useState<number | null>(null);
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState('');
  const [scheduleAirTime, setScheduleAirTime] = useState('');
  const [scheduleNote, setScheduleNote] = useState('');
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);

  // Ngày trong tuần: luôn gửi mã số (1–7) lên API để tránh lỗi khi dùng chữ; hiển thị "Thứ 2", "Chủ nhật"...
  const SCHEDULE_DAY_OPTIONS: { value: string; label: string }[] = [
    { value: '1', label: 'Thứ 2' },
    { value: '2', label: 'Thứ 3' },
    { value: '3', label: 'Thứ 4' },
    { value: '4', label: 'Thứ 5' },
    { value: '5', label: 'Thứ 6' },
    { value: '6', label: 'Thứ 7' },
    { value: '7', label: 'Chủ nhật' }
  ];
  const scheduleDayLabel = (day: string) =>
    SCHEDULE_DAY_OPTIONS.find((o) => o.value === String(day).trim())?.label ?? day;
  const scheduleDayToValue = (day: string): string => {
    const d = String(day).trim();
    const byLabel = SCHEDULE_DAY_OPTIONS.find((o) => o.label === d);
    if (byLabel) return byLabel.value;
    if (d >= '1' && d <= '7') return d;
    return d;
  };

  function formatDateTime(value: string | null | undefined) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('vi-VN');
  }

  function getMovieTypeLabel(movieTypeValue: number | null | undefined): string | null {
    if (movieTypeValue == null) return null;
    if (movieTypeValue === 1) return 'Phim lẻ';
    if (movieTypeValue === 2) return 'Phim bộ';
    return `Loại ${movieTypeValue}`;
  }

  // Gợi ý số tập tiếp theo dựa trên danh sách tập hiện có của admin
  useEffect(() => {
    if (!movie) return;
    if (editingEpisodeId != null) return;

    // Phim bộ: luôn tự động gợi ý số tập tiếp theo sau mỗi lần danh sách tập thay đổi
    if (movie.movieType === 2) {
      if (!adminEpisodes || !adminEpisodes.length) {
        if (episodeNumber !== '1') {
          setEpisodeNumber('1');
        }
        return;
      }
      const maxEpisode = adminEpisodes.reduce((max, e) => {
        const num = typeof e.episodeNumber === 'number' ? e.episodeNumber : Number(e.episodeNumber ?? 0);
        return Number.isFinite(num) && num > max ? num : max;
      }, 0);
      const nextEpisode = (maxEpisode || 0) + 1;
      const nextStr = String(nextEpisode);
      if (episodeNumber !== nextStr) {
        setEpisodeNumber(nextStr);
      }
      return;
    }

    // Phim lẻ: nếu chưa có tập nào thì mặc định = 1; nếu đã có tập thì để trống (bắt user sửa/xóa tập hiện tại)
    if (!adminEpisodes || !adminEpisodes.length) {
      setEpisodeNumber('1');
    } else if (!episodeNumber) {
      setEpisodeNumber('');
    }
  }, [movie, adminEpisodes, editingEpisodeId, episodeNumber]);

  function openEditInfoForm(m: MovieDetailType) {
    setTitle(m.title);
    setReleaseYear(m.releaseYear != null ? String(m.releaseYear) : '');
    setDuration(m.duration != null ? String(m.duration) : '');
    setStatus(m.status ?? '');
    setMovieType(m.movieType != null ? String(m.movieType) : '');
    setTotalEpisodes(m.totalEpisodes != null ? String(m.totalEpisodes) : '');
    setPoster(m.poster ?? '');
    setDescription(m.description ?? '');
    setIsEditingInfo(true);
  }

  function handleSubmitBasicInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !movie) return;

    updateMovieMutation.mutate(
      {
        id,
        payload: {
          title: title.trim() || movie.title,
          description: description.trim() || movie.description || '',
          releaseYear: releaseYear ? Number(releaseYear) : movie.releaseYear,
          duration: duration ? Number(duration) : movie.duration,
          status: status || movie.status,
          movieType: movieType ? Number(movieType) : movie.movieType,
          totalEpisodes: totalEpisodes ? Number(totalEpisodes) : movie.totalEpisodes,
          poster: poster || movie.poster
        }
      },
      {
        onSuccess: () => {
          setIsEditingInfo(false);
          showToast('Đã lưu thông tin phim.', 'success');
        },
        onError: (err) => {
          showToast((err as Error)?.message ?? 'Lưu thông tin thất bại.', 'error');
        }
      }
    );
  }

  const initialGenreIds = useMemo(() => {
    if (!movie || !allGenres.length) return [];
    const nameToId = new Map<string, number>();
    allGenres.forEach((g: any) => {
      nameToId.set(g.name, g.id);
    });
    return (movie.genres ?? [])
      .map((name) => nameToId.get(name))
      .filter((idValue): idValue is number => typeof idValue === 'number');
  }, [movie, allGenres]);

  const effectiveSelectedGenreIds = selectedGenreIds.length ? selectedGenreIds : initialGenreIds;

  const initialActorIds = useMemo(() => {
    if (!cast || !cast.actors?.length) return [];
    return cast.actors.map((a) => a.id);
  }, [cast]);

  const initialDirectorIds = useMemo(() => {
    if (!cast || !cast.directors?.length) return [];
    return cast.directors.map((d) => d.id);
  }, [cast]);

  const effectiveSelectedActorIds = selectedActorIds.length ? selectedActorIds : initialActorIds;
  const effectiveSelectedDirectorIds = selectedDirectorIds.length ? selectedDirectorIds : initialDirectorIds;

  function handleToggleGenre(idValue: number) {
    setSelectedGenreIds((prev) =>
      prev.includes(idValue) ? prev.filter((gid) => gid !== idValue) : [...prev, idValue]
    );
  }

  function handleSaveGenres() {
    if (!id || !movie) return;

    const genreIdsPayload = effectiveSelectedGenreIds.length ? effectiveSelectedGenreIds : null;

    updateMovieMutation.mutate(
      {
        id,
        payload: {
          title: movie.title,
          description: movie.description,
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          status: movie.status,
          movieType: movie.movieType,
          totalEpisodes: movie.totalEpisodes,
          poster: movie.poster,
          genreIds: genreIdsPayload,
          actorIds: effectiveSelectedActorIds.length ? effectiveSelectedActorIds : null,
          directorIds: effectiveSelectedDirectorIds.length ? effectiveSelectedDirectorIds : null
        }
      },
      {
        onSuccess: () => showToast('Đã lưu thể loại.', 'success'),
        onError: (err) => showToast((err as Error)?.message ?? 'Lưu thể loại thất bại.', 'error')
      }
    );
  }

  function handleSaveCast() {
    if (!id || !movie) return;
    const genreIdsPayload = effectiveSelectedGenreIds.length ? effectiveSelectedGenreIds : null;
    updateMovieMutation.mutate(
      {
        id,
        payload: {
          title: movie.title,
          description: movie.description,
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          status: movie.status,
          movieType: movie.movieType,
          totalEpisodes: movie.totalEpisodes,
          poster: movie.poster,
          genreIds: genreIdsPayload,
          actorIds: effectiveSelectedActorIds.length ? effectiveSelectedActorIds : null,
          directorIds: effectiveSelectedDirectorIds.length ? effectiveSelectedDirectorIds : null
        }
      },
      {
        onSuccess: () => showToast('Đã lưu nhân sự.', 'success'),
        onError: (err) => showToast((err as Error)?.message ?? 'Lưu nhân sự thất bại.', 'error')
      }
    );
  }

  if (id == null || Number.isNaN(id)) {
    return (
      <AdminErrorState message="ID phim không hợp lệ. Vui lòng kiểm tra đường dẫn." />
    );
  }

  if (isMovieLoading) {
    return <AdminDetailSkeleton />;
  }

  if (isMovieError || !movie) {
    const message =
      (movieError as Error)?.message ??
      (isMovieError && !movie ? 'Phim không tồn tại hoặc đã bị xóa.' : 'Không thể tải thông tin phim.');
    return <AdminErrorState message={message} />;
  }

  const movieTypeLabel = getMovieTypeLabel(movie.movieType);

  return (
    <div className="movie-detail-page">
      <header className="admin-page-header">
        <div className="admin-page-header-main">
          <h1>Quản trị phim</h1>
          <p>
            Chỉnh sửa thông tin, lịch chiếu, tập phim và nhân sự cho phim&nbsp;
            <strong>{movie.title}</strong>.
          </p>
        </div>
        <Link href="/admin/movies" className="movie-detail-back">
          ← Quay lại danh sách phim
        </Link>
      </header>

      {toast && (
        <div
          className={`admin-toast admin-toast-fixed ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <MovieDetail
        movie={movie}
        showActions={false}
        showEpisodes={false}
        showRecommendations={false}
        showComments={false}
        extraMetaContent={
          <button
            type="button"
            className="admin-button-primary"
            onClick={() => openEditInfoForm(movie)}
            disabled={updateMovieMutation.isPending}
          >
            Chỉnh sửa thông tin
          </button>
        }
      />

      {isEditingInfo && (
        <section className="admin-section">
          <h2 className="admin-section-title">Chỉnh sửa thông tin</h2>
          <form className="admin-form" onSubmit={handleSubmitBasicInfo}>
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="title">
                  Tiêu đề
                </label>
                <input
                  id="title"
                  className="admin-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="releaseYear">
                  Năm phát hành
                </label>
                <input
                  id="releaseYear"
                  className="admin-input"
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="duration">
                  Thời lượng (phút)
                </label>
                <input
                  id="duration"
                  className="admin-input"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="status">
                  Trạng thái
                </label>
                <input
                  id="status"
                  className="admin-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="movieType">
                  Loại phim (1 = lẻ, 2 = bộ)
                </label>
                <input
                  id="movieType"
                  className="admin-input"
                  type="number"
                  min={1}
                  max={2}
                  value={movieType}
                  onChange={(e) => setMovieType(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="totalEpisodes">
                  Số tập (dự kiến)
                </label>
                <input
                  id="totalEpisodes"
                  className="admin-input"
                  type="number"
                  value={totalEpisodes}
                  onChange={(e) => setTotalEpisodes(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="poster">
                  Poster URL
                </label>
                <input
                  id="poster"
                  className="admin-input"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="admin-form-field admin-form-field-full">
              <label className="admin-form-label" htmlFor="description">
                Nội dung
              </label>
              <textarea
                id="description"
                className="admin-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="admin-form-submit-row">
              <button
                type="submit"
                className="admin-button-primary"
                disabled={updateMovieMutation.isPending}
              >
                {updateMovieMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => setIsEditingInfo(false)}
                disabled={updateMovieMutation.isPending}
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">Lịch chiếu</h2>

        {isSchedulesLoading && <p>Đang tải lịch chiếu...</p>}
        {isSchedulesError && <p>Không thể tải lịch chiếu. Vui lòng thử lại sau.</p>}
        {!isSchedulesLoading && !isSchedulesError && schedules && schedules.length === 0 && (
          <p>Chưa có lịch chiếu nào cho phim này.</p>
        )}
        {!isSchedulesLoading && !isSchedulesError && schedules && schedules.length > 0 && (
          <table className="admin-table admin-section-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ngày trong tuần</th>
                <th>Giờ chiếu</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{scheduleDayLabel('dayOfWeek' in s ? s.dayOfWeek : (s as Record<string, unknown>).day_of_week ?? '')}</td>
                  <td>{s.airTime}</td>
                  <td>{s.note || '-'}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-table-button"
                      onClick={() => {
                        setEditingScheduleId(s.id);
                        const day = String(
                          'dayOfWeek' in s ? s.dayOfWeek : (s as Record<string, unknown>).day_of_week ?? ''
                        ).trim();
                        const rawTime =
                          'airTime' in s ? s.airTime : (s as Record<string, unknown>).air_time ?? '';
                        const time = rawTime ? String(rawTime).trim().slice(0, 5) : '';
                        setScheduleDayOfWeek(scheduleDayToValue(day));
                        setScheduleAirTime(time);
                        setScheduleNote(s.note ?? '');
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="admin-table-button admin-table-button-danger"
                      onClick={() => {
                        if (!id) return;
                        // eslint-disable-next-line no-alert
                        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) return;
                        deleteScheduleMutation.mutate(
                          { movieId: id, scheduleId: s.id },
                          {
                            onSuccess: () => showToast('Đã xóa lịch chiếu.', 'success'),
                            onError: (err) => showToast((err as Error)?.message ?? 'Xóa lịch chiếu thất bại.', 'error')
                          }
                        );
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!id) return;
            if (!scheduleDayOfWeek.trim() || !scheduleAirTime.trim()) return;
            const dayValue = scheduleDayToValue(scheduleDayOfWeek);
            const payload = {
              dayOfWeek: dayValue,
              airTime: scheduleAirTime.trim(),
              note: scheduleNote.trim() || null
            };
            const resetForm = () => {
              setEditingScheduleId(null);
              setScheduleDayOfWeek('');
              setScheduleAirTime('');
              setScheduleNote('');
            };
            const editingId =
              editingScheduleId != null ? Number(editingScheduleId) : undefined;
            const existingByDayTime = schedules?.find((s) => {
              const d =
                'dayOfWeek' in s ? s.dayOfWeek : (s as Record<string, unknown>).day_of_week ?? '';
              const t = 'airTime' in s ? s.airTime : (s as Record<string, unknown>).air_time ?? '';
              return (
                scheduleDayToValue(String(d)) === payload.dayOfWeek &&
                (t ? String(t).trim().slice(0, 5) : '') === payload.airTime
              );
            });
            const scheduleIdToUpdate = editingId ?? existingByDayTime?.id;
            if (scheduleIdToUpdate != null && Number.isInteger(Number(scheduleIdToUpdate))) {
              updateScheduleMutation.mutate(
                {
                  movieId: id,
                  scheduleId: Number(scheduleIdToUpdate),
                  payload
                },
                {
                  onSuccess: () => {
                    resetForm();
                    showToast('Đã cập nhật lịch chiếu.', 'success');
                  },
                  onError: (err) => showToast((err as Error)?.message ?? 'Cập nhật lịch chiếu thất bại.', 'error')
                }
              );
            } else {
              createScheduleMutation.mutate(
                { movieId: id, payload },
                {
                  onSuccess: () => {
                    resetForm();
                    showToast('Đã thêm lịch chiếu.', 'success');
                  },
                  onError: (err) => showToast((err as Error)?.message ?? 'Thêm lịch chiếu thất bại.', 'error')
                }
              );
            }
          }}
        >
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="scheduleDayOfWeek">
                Ngày trong tuần
              </label>
              <select
                id="scheduleDayOfWeek"
                className="admin-input admin-select"
                value={scheduleDayOfWeek}
                onChange={(e) => setScheduleDayOfWeek(e.target.value)}
              >
                <option value="">Chọn ngày</option>
                {SCHEDULE_DAY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
                {scheduleDayOfWeek &&
                  !SCHEDULE_DAY_OPTIONS.some((o) => o.value === scheduleDayOfWeek) && (
                    <option value={scheduleDayOfWeek}>
                      {scheduleDayLabel(scheduleDayOfWeek)}
                    </option>
                  )}
              </select>
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="scheduleAirTime">
                Giờ chiếu
              </label>
              <select
                id="scheduleAirTime"
                className="admin-input admin-select"
                value={scheduleAirTime}
                onChange={(e) => setScheduleAirTime(e.target.value)}
              >
                <option value="">Chọn giờ</option>
                {Array.from({ length: 36 }, (_, i) => {
                  const totalMins = 6 * 60 + i * 30;
                  const h = Math.floor(totalMins / 60);
                  const m = totalMins % 60;
                  const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
                {scheduleAirTime &&
                  !Array.from({ length: 36 }, (_, i) => {
                    const totalMins = 6 * 60 + i * 30;
                    const h = Math.floor(totalMins / 60);
                    const m = totalMins % 60;
                    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  }).includes(scheduleAirTime) && (
                    <option value={scheduleAirTime}>{scheduleAirTime}</option>
                  )}
              </select>
            </div>
            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="scheduleNote">
                Ghi chú
              </label>
              <input
                id="scheduleNote"
                className="admin-input"
                value={scheduleNote}
                onChange={(e) => setScheduleNote(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-form-submit-row">
            <button
              type="submit"
              className="admin-button-primary"
              disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
            >
              {editingScheduleId != null
                ? updateScheduleMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu thay đổi'
                : createScheduleMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Thể loại</h2>
          <button
            type="button"
            className="admin-button-primary"
            onClick={handleSaveGenres}
            disabled={updateMovieMutation.isPending}
          >
            Lưu thể loại
          </button>
        </div>

        {!allGenres.length && <p>Đang tải danh sách thể loại...</p>}
        {allGenres.length > 0 && (
          <div className="account-genres-wrap" style={{ marginTop: '0.75rem' }}>
            {allGenres.map((g: any) => (
              <button
                key={g.id}
                type="button"
                className="account-genre-chip"
                onClick={() => handleToggleGenre(g.id)}
                aria-pressed={effectiveSelectedGenreIds.includes(g.id)}
              >
                <span>{g.name}</span>
                {effectiveSelectedGenreIds.includes(g.id) && (
                  <span style={{ marginLeft: '0.35rem' }}>✕</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="admin-section">
        <h2 className="admin-section-title">Tập phim</h2>
        {movie.movieType !== 2 && (
          <p>
            Phim lẻ – bạn có thể thêm <strong>01 tập</strong> với Video URL để hệ thống phát phim.
          </p>
        )}
        {(isEpisodesLoading || isAdminEpisodesLoading) && (
          <p>Đang tải danh sách tập...</p>
        )}
        {(isEpisodesError || isAdminEpisodesError) && (
          <p>Không thể tải danh sách tập. Vui lòng thử lại sau.</p>
        )}
        {adminEpisodes &&
          !isEpisodesLoading &&
          !isAdminEpisodesLoading &&
          !isEpisodesError &&
          !isAdminEpisodesError && (
            <div className="admin-table-wrap">
            <table className="admin-table admin-section-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tập</th>
                  <th className="admin-table-url-cell">Video URL</th>
                  <th>Ngày phát hành</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {adminEpisodes.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.episodeNumber}</td>
                    <td className="admin-table-url-cell">
                      <span className="admin-table-url" title={e.videoUrl}>
                        {e.videoUrl}
                      </span>
                    </td>
                    <td>{e.releaseTime || '-'}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-table-button"
                        onClick={() => {
                          setEditingEpisodeId(e.id);
                          setEpisodeNumber(String(e.episodeNumber));
                          setEpisodeVideoUrl(e.videoUrl);
                          setEpisodeReleaseTime(e.releaseTime ? e.releaseTime.slice(0, 16) : '');
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="admin-table-button admin-table-button-danger"
                        onClick={() => {
                          if (!id) return;
                          // eslint-disable-next-line no-alert
                          if (!window.confirm('Bạn có chắc chắn muốn xóa tập này?')) return;
                          deleteEpisodeMutation.mutate(
                            { movieId: id, episodeId: e.id },
                            {
                              onSuccess: () => showToast('Đã xóa tập phim.', 'success'),
                              onError: (err) => showToast((err as Error)?.message ?? 'Xóa tập phim thất bại.', 'error')
                            }
                          );
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

        {(movie.movieType === 2 || !adminEpisodes || adminEpisodes.length === 0 || editingEpisodeId != null) && (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!id) return;
              const payload = {
                episodeNumber: Number(episodeNumber),
                videoUrl: episodeVideoUrl.trim(),
                releaseTime: episodeReleaseTime ? new Date(episodeReleaseTime).toISOString() : null
              };
              if (!payload.episodeNumber || !payload.videoUrl) return;

              const resetForm = () => {
                setEditingEpisodeId(null);
                setEpisodeNumber('');
                setEpisodeVideoUrl('');
                setEpisodeReleaseTime('');
              };
              if (editingEpisodeId != null) {
                updateEpisodeMutation.mutate(
                  {
                    movieId: id,
                    episodeId: editingEpisodeId,
                    payload
                  },
                  {
                    onSuccess: () => {
                      resetForm();
                      showToast('Đã cập nhật tập phim.', 'success');
                    },
                    onError: (err) => showToast((err as Error)?.message ?? 'Cập nhật tập phim thất bại.', 'error')
                  }
                );
              } else {
                createEpisodeMutation.mutate(
                  { movieId: id, payload },
                  {
                    onSuccess: () => {
                      resetForm();
                      showToast('Đã thêm tập phim.', 'success');
                    },
                    onError: (err) => showToast((err as Error)?.message ?? 'Thêm tập phim thất bại.', 'error')
                  }
                );
              }
            }}
          >
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="episodeNumber">
                  Số tập
                </label>
                <input
                  id="episodeNumber"
                  className="admin-input"
                  type="number"
                  min={1}
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="episodeVideoUrl">
                  Video URL
                </label>
                <input
                  id="episodeVideoUrl"
                  className="admin-input"
                  value={episodeVideoUrl}
                  onChange={(e) => setEpisodeVideoUrl(e.target.value)}
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label" htmlFor="episodeReleaseTime">
                  Thời gian phát hành
                </label>
                <input
                  id="episodeReleaseTime"
                  className="admin-input"
                  type="datetime-local"
                  value={episodeReleaseTime}
                  onChange={(e) => setEpisodeReleaseTime(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-form-submit-row">
              <button
                type="submit"
                className="admin-button-primary"
                disabled={createEpisodeMutation.isPending || updateEpisodeMutation.isPending}
              >
                {editingEpisodeId != null
                  ? updateEpisodeMutation.isPending
                    ? 'Đang lưu...'
                    : 'Lưu thay đổi'
                  : createEpisodeMutation.isPending
                    ? 'Đang lưu...'
                    : 'Lưu'}
              </button>
            </div>
          </form>
        )}
      </section>
      <section className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Nhân sự</h2>
          <button
            type="button"
            className="admin-button-primary"
            onClick={handleSaveCast}
            disabled={updateMovieMutation.isPending}
          >
            {updateMovieMutation.isPending ? 'Đang lưu...' : 'Lưu nhân sự'}
          </button>
        </div>
        {isCastLoading && <p>Đang tải danh sách đạo diễn và diễn viên...</p>}
        {isCastError && <p>Không thể tải danh sách nhân sự. Vui lòng thử lại sau.</p>}
        {cast && !isCastLoading && !isCastError && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <h3 className="admin-section-title" style={{ fontSize: '1rem' }}>
                Đạo diễn
              </h3>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
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
                            setSelectedDirectorIds((prev) => {
                              const base = prev.length > 0 ? prev : initialDirectorIds;
                              return base.includes(d.id) ? base : [...base, d.id];
                            });
                            setAddedDirectorNames((prev) => ({ ...prev, [d.id]: d.fullName }));
                            setDirectorQuery('');
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
              {effectiveSelectedDirectorIds.length === 0 ? (
                <p>Chưa có đạo diễn nào được gắn cho phim này. Chọn ở trên rồi bấm &quot;Lưu nhân sự&quot;.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ tên</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveSelectedDirectorIds.map((dirId) => {
                      const fullName =
                        cast.directors.find((d) => d.id === dirId)?.fullName ??
                        addedDirectorNames[dirId] ??
                        `#${dirId}`;
                      return (
                        <tr key={dirId}>
                          <td>{dirId}</td>
                          <td>{fullName}</td>
                          <td>
                            <button
                              type="button"
                              className="admin-table-button admin-table-button-danger"
                              onClick={() =>
                                setSelectedDirectorIds((prev) => {
                                  const base = prev.length > 0 ? prev : initialDirectorIds;
                                  const idNum = Number(dirId);
                                  return base.filter((idValue) => Number(idValue) !== idNum);
                                })
                              }
                            >
                              Gỡ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div>
              <h3 className="admin-section-title" style={{ fontSize: '1rem' }}>
                Diễn viên
              </h3>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
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
                            setSelectedActorIds((prev) => {
                              const base = prev.length > 0 ? prev : initialActorIds;
                              return base.includes(a.id) ? base : [...base, a.id];
                            });
                            setAddedActorNames((prev) => ({ ...prev, [a.id]: a.fullName }));
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
              </div>
              {effectiveSelectedActorIds.length === 0 ? (
                <p>Chưa có diễn viên nào được gắn cho phim này. Chọn ở trên rồi bấm &quot;Lưu nhân sự&quot;.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ tên</th>
                      <th>Vai diễn</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveSelectedActorIds.map((actorId) => {
                      const actor = cast.actors.find((a) => a.id === actorId);
                      const fullName =
                        actor?.fullName ?? addedActorNames[actorId] ?? `#${actorId}`;
                      const characterName = actor?.characterName ?? '-';
                      return (
                        <tr key={actorId}>
                          <td>{actorId}</td>
                          <td>{fullName}</td>
                          <td>{characterName}</td>
                          <td>
                            <button
                              type="button"
                              className="admin-table-button admin-table-button-danger"
                              onClick={() =>
                                setSelectedActorIds((prev) => {
                                  const base = prev.length > 0 ? prev : initialActorIds;
                                  const idNum = Number(actorId);
                                  return base.filter((idValue) => Number(idValue) !== idNum);
                                })
                              }
                            >
                              Gỡ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Thống kê tương tác</h2>
        {isStatsLoading && <p>Đang tải thống kê...</p>}
        {isStatsError && <p>Không thể tải thống kê. Vui lòng thử lại sau.</p>}
        {stats && !isStatsLoading && !isStatsError && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <p className="admin-stat-label">Lượt thích</p>
              <p className="admin-stat-value">{stats.likesCount}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Số lượt đánh giá</p>
              <p className="admin-stat-value">{stats.ratingsCount}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Điểm trung bình</p>
              <p className="admin-stat-value">
                {stats.averageRating != null && !Number.isNaN(stats.averageRating)
                  ? stats.averageRating.toFixed(1)
                  : '-'}
              </p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Số bình luận</p>
              <p className="admin-stat-value">{stats.commentsCount}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Lượt xem</p>
              <p className="admin-stat-value">{stats.watchLogsCount}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Xem hoàn thành</p>
              <p className="admin-stat-value">{stats.completedViewsCount}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

