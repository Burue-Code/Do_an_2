'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useAdminSchedules, useCreateAdminSchedule, useDeleteAdminSchedule, useUpdateAdminSchedule } from '@/features/admin-schedule/hooks';
import { MovieSuggestion, searchMovieSuggestions } from '@/features/admin-schedule/api';

const DAY_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Thứ 2' },
  { value: '2', label: 'Thứ 3' },
  { value: '3', label: 'Thứ 4' },
  { value: '4', label: 'Thứ 5' },
  { value: '5', label: 'Thứ 6' },
  { value: '6', label: 'Thứ 7' },
  { value: '7', label: 'Chủ nhật' }
];

export default function AdminSchedulesPage() {
  const { data = [], isLoading, isError, error } = useAdminSchedules();
  const createMut = useCreateAdminSchedule();
  const updateMut = useUpdateAdminSchedule();
  const deleteMut = useDeleteAdminSchedule();

  const formRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [movieId, setMovieId] = useState('');
  const [movieQuery, setMovieQuery] = useState('');
  const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suppressNextSearch, setSuppressNextSearch] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [airTime, setAirTime] = useState('');
  const [note, setNote] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (suppressNextSearch) {
      setSuppressNextSearch(false);
      return;
    }
    let active = true;
    const keyword = movieQuery;
    if (!keyword.trim()) {
      setMovieSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      searchMovieSuggestions(keyword)
        .then((items) => {
          if (active) {
            setMovieSuggestions(items);
          }
        })
        .catch(() => {
          if (active) setMovieSuggestions([]);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [movieQuery, suppressNextSearch]);

  const normalizeAirTime = (value: string) => {
    const v = (value || '').trim();
    // nếu dạng HH:mm:ss thì cắt còn HH:mm
    if (v.length >= 5 && v.split(':').length >= 2) {
      return v.slice(0, 5);
    }
    return v;
  };

  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        const da = Number(a.dayOfWeek || 99);
        const db = Number(b.dayOfWeek || 99);
        if (da !== db) return da - db;
        if (a.airTime !== b.airTime) return (a.airTime || '').localeCompare(b.airTime || '');
        return a.id - b.id;
      }),
    [data]
  );

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((s) => {
      const title = (s.movieTitle || '').toLowerCase();
      const noteText = (s.note || '').toLowerCase();
      const idText = String(s.id);
      const movieIdText = String(s.movieId);
      return (
        title.includes(q) ||
        noteText.includes(q) ||
        idText.includes(q) ||
        movieIdText.includes(q)
      );
    });
  }, [sorted, searchText]);

  const resetForm = () => {
    setEditingId(null);
    setMovieId('');
    setMovieQuery('');
    setMovieSuggestions([]);
    setShowSuggestions(false);
    setSuppressNextSearch(false);
    setDayOfWeek('1');
    setAirTime('');
    setNote('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mid = Number(movieId);
    if (!mid || Number.isNaN(mid)) return;
    const payload = {
      movieId: mid,
      dayOfWeek,
      airTime,
      note: note.trim() || undefined
    };
    if (editingId) {
      updateMut.mutate({ id: editingId, payload }, { onSuccess: resetForm });
    } else {
      createMut.mutate(payload, { onSuccess: resetForm });
    }
  };

  const onEdit = (id: number) => {
    const item = data.find((s) => s.id === id);
    if (!item) return;
    setEditingId(id);
    setMovieId(String(item.movieId));
    setMovieQuery((item.movieTitle ?? '').trim() || String(item.movieId));
    setMovieSuggestions([]);
    setShowSuggestions(false);
    setSuppressNextSearch(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setDayOfWeek(item.dayOfWeek);
    setAirTime(normalizeAirTime(item.airTime));
    setNote(item.note || '');
  };

  const onDelete = (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch chiếu này?')) return;
    deleteMut.mutate(id);
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý lịch chiếu</h1>
        <p>Tạo và chỉnh sửa lịch chiếu phim theo thứ trong tuần và giờ chiếu.</p>
      </header>

      <section className="admin-section">
        <div ref={formRef}>
        <h2 className="admin-section-title">{editingId ? 'Sửa lịch chiếu' : 'Thêm lịch chiếu'}</h2>
        <form className="admin-form-grid" onSubmit={onSubmit}>
          <div className="admin-form-field">
            <label className="admin-label">ID phim</label>
            <div className="admin-autocomplete">
              <input
                className="admin-input"
                value={movieQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setMovieQuery(v);
                  setShowSuggestions(true);
                  const asNumber = Number(v);
                  if (!Number.isNaN(asNumber) && asNumber > 0) {
                    setMovieId(String(asNumber));
                  } else {
                    setMovieId('');
                  }
                }}
                onFocus={() => {
                  if (movieSuggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                placeholder="Nhập tên hoặc ID phim..."
                required
              />
              {showSuggestions && movieSuggestions.length > 0 && (
                <ul className="admin-autocomplete-list">
                  {movieSuggestions.map((m) => (
                    <li
                      key={m.id}
                      className="admin-autocomplete-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setMovieId(String(m.id));
                        setMovieQuery(`${m.title} (#${m.id})`);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="admin-autocomplete-title">{m.title}</span>
                      <span className="admin-autocomplete-id">#{m.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="admin-form-field">
            <label className="admin-label">Thứ</label>
            <select
              className="admin-select"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label className="admin-label">Giờ chiếu (HH:mm)</label>
            <input
              className="admin-input"
              value={airTime}
              onChange={(e) => setAirTime(e.target.value)}
              placeholder="Ví dụ: 20:00"
              required
            />
          </div>
          <div className="admin-form-field">
            <label className="admin-label">Ghi chú</label>
            <input
              className="admin-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tùy chọn (ví dụ: Suất tối, Vietsub...)"
            />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-button-primary" disabled={createMut.isLoading || updateMut.isLoading}>
              {editingId ? 'Lưu thay đổi' : 'Thêm lịch chiếu'}
            </button>
            {editingId && (
              <button type="button" className="admin-button-secondary" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách lịch chiếu</h2>

        <div className="admin-list-filters">
          <input
            className="admin-input"
            placeholder="Tìm theo tên phim, ID, ghi chú..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {isLoading && <p>Đang tải lịch chiếu...</p>}
        {isError && <p>Không thể tải lịch chiếu: {(error as Error)?.message}</p>}

        {!isLoading && !isError && filtered.length === 0 && <p>Chưa có lịch chiếu nào.</p>}

        {!isLoading && !isError && filtered.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phim</th>
                <th>Thứ</th>
                <th>Giờ chiếu</th>
                <th>Ghi chú</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    {s.movieTitle} (#{s.movieId})
                  </td>
                  <td>{DAY_OPTIONS.find((d) => d.value === s.dayOfWeek)?.label ?? s.dayOfWeek}</td>
                  <td>{s.airTime}</td>
                  <td>{s.note || '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-table-button"
                        onClick={() => onEdit(s.id)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="admin-table-button admin-table-button-danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

