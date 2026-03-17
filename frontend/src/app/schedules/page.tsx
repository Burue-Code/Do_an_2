'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSchedules } from '@/features/schedule/hooks';
import { getPosterUrl } from '@/lib/image';

const DAY_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Thứ 2' },
  { value: '2', label: 'Thứ 3' },
  { value: '3', label: 'Thứ 4' },
  { value: '4', label: 'Thứ 5' },
  { value: '5', label: 'Thứ 6' },
  { value: '6', label: 'Thứ 7' },
  { value: '7', label: 'Chủ nhật' }
];

function dayLabel(value: string) {
  return DAY_OPTIONS.find((d) => d.value === String(value).trim())?.label ?? value;
}

export default function SchedulesPage() {
  const [dayOfWeek, setDayOfWeek] = useState<string>('1');
  const [page, setPage] = useState(1);
  const { data = [], isLoading, isError } = useSchedules(dayOfWeek);

  useEffect(() => {
    // mặc định chọn theo ngày hiện tại (local)
    const jsDay = new Date().getDay(); // 0=CN..6=Th7
    const mapped = jsDay === 0 ? '7' : String(jsDay); // 1=Th2..6=Th7
    setDayOfWeek(mapped);
  }, []);

  useEffect(() => {
    // đổi ngày thì quay về trang 1
    setPage(1);
  }, [dayOfWeek]);

  const items = useMemo(() => data, [data]);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, currentPage]);

  return (
    <div className="account-page">
      <header className="account-header">
        <div>
          <h1>Lịch chiếu</h1>
        </div>
      </header>

      <section className="account-section">
        <div className="account-section-header">
        </div>

        <div className="schedule-day-buttons" role="tablist" aria-label="Chọn ngày trong tuần">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              role="tab"
              aria-selected={dayOfWeek === d.value}
              className={`schedule-day-btn ${dayOfWeek === d.value ? 'schedule-day-btn-active' : ''}`}
              onClick={() => setDayOfWeek(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isLoading && <p>Đang tải lịch chiếu...</p>}
        {isError && <p>Không thể tải lịch chiếu. Vui lòng thử lại.</p>}
        {!isLoading && !isError && data.length === 0 && <p>Chưa có lịch chiếu nào.</p>}

        {!isLoading && !isError && data.length > 0 && (
          <section className="admin-section" style={{ marginBottom: 0 }}>
            <h3 className="admin-section-title" style={{ marginBottom: '0.75rem' }}>
              {dayLabel(dayOfWeek)}
            </h3>
            <div className="schedule-cards">
              {pagedItems.map((it, idx) => {
                const posterUrl = it.movie ? getPosterUrl(it.movie.poster) : null;
                return (
                  <Link
                    key={`${it.movie?.id ?? 'm'}-${it.airTime}-${idx}`}
                    href={it.movie ? `/movies/${it.movie.id}` : '/movies'}
                    className="schedule-card"
                  >
                    <div className="schedule-card-poster">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={it.movie?.title ?? 'Movie'}
                          fill
                          sizes="220px"
                          className="schedule-card-img"
                          unoptimized
                        />
                      ) : (
                        <div className="schedule-card-placeholder">No poster</div>
                      )}
                      <span className="schedule-card-time">{it.airTime}</span>
                    </div>
                    <div className="schedule-card-info">
                      <h4 className="schedule-card-title">{it.movie?.title ?? '—'}</h4>
                      {it.note ? <p className="schedule-card-note">{it.note}</p> : <p className="schedule-card-note">—</p>}
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="schedule-pagination" aria-label="Phân trang lịch chiếu">
                <button
                  type="button"
                  className="schedule-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>
                <div className="schedule-page-numbers" role="navigation" aria-label="Chọn trang">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                    .map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`schedule-page-btn ${p === currentPage ? 'schedule-page-btn-active' : ''}`}
                        onClick={() => setPage(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    ))}
                </div>
                <button
                  type="button"
                  className="schedule-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
}

