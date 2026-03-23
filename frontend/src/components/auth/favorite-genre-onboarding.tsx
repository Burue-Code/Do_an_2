'use client';

import { useUpdateFavoriteGenres } from '@/features/auth/hooks';
import { useGenres } from '@/features/genre/hooks';
import { useAuthContext } from '@/providers/auth-provider';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const DISMISS_KEY = (userId: number) => `genreOnboarding:dismissed:${userId}`;

function isAdminRole(role: string | undefined): boolean {
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
}

function readDismissed(userId: number): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DISMISS_KEY(userId)) === '1';
}

export function FavoriteGenreOnboarding() {
  const { user, isLoading: authLoading } = useAuthContext();
  const pathname = usePathname();
  const { data: genres = [], isLoading: genresLoading } = useGenres();
  const updateFavoriteGenres = useUpdateFavoriteGenres();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const ids = user?.favoriteGenreIds;
  const hasGenres = Array.isArray(ids) && ids.length > 0;

  const hideOnPaths =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/admin');

  useEffect(() => {
    if (!user?.id) {
      setDismissed(false);
      return;
    }
    setDismissed(readDismissed(user.id));
  }, [user?.id]);

  const handleDismiss = useCallback(() => {
    if (!user?.id) return;
    localStorage.setItem(DISMISS_KEY(user.id), '1');
    setDismissed(true);
  }, [user?.id]);

  const needsPrompt =
    !authLoading &&
    !genresLoading &&
    !!user &&
    !isAdminRole(user.role) &&
    !hideOnPaths &&
    !hasGenres &&
    !dismissed;

  useEffect(() => {
    if (!needsPrompt) return;
    setSelectedIds([]);
    setError(null);
  }, [needsPrompt, user?.id]);

  useEffect(() => {
    if (!needsPrompt) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [needsPrompt]);

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setError('Vui lòng chọn ít nhất một thể loại.');
      return;
    }
    setError(null);
    try {
      await updateFavoriteGenres.mutateAsync(selectedIds);
    } catch {
      setError('Không thể lưu. Vui lòng thử lại.');
    }
  };

  if (!needsPrompt) {
    return null;
  }

  return (
    <div
      className="genre-onboarding-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="genre-onboarding-title"
    >
      <div className="genre-onboarding-panel">
        <button
          type="button"
          className="genre-onboarding-close"
          onClick={handleDismiss}
          disabled={updateFavoriteGenres.isPending}
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 id="genre-onboarding-title" className="genre-onboarding-title">
          Chọn thể loại yêu thích
        </h2>
        <p className="genre-onboarding-desc">
          Chọn thể loại để gợi ý phim phù hợp hơn — hoặc bấm Hủy để để sau (bạn vẫn có thể chọn trong trang cá nhân).
        </p>
        <form onSubmit={handleSubmit} className="genre-onboarding-form">
          <div className="account-genres-wrap">
            {genres.map((g) => {
              const id = Number(g.id);
              return (
                <label key={g.id} className="account-genre-chip">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(id)}
                    onChange={() => toggle(id)}
                  />
                  <span>{g.name}</span>
                </label>
              );
            })}
          </div>
          {error && <p className="genre-onboarding-error">{error}</p>}
          <div className="genre-onboarding-actions">
            <button
              type="button"
              className="genre-onboarding-btn-cancel"
              onClick={handleDismiss}
              disabled={updateFavoriteGenres.isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="account-profile-btn genre-onboarding-submit"
              disabled={updateFavoriteGenres.isPending}
            >
              {updateFavoriteGenres.isPending ? 'Đang lưu...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
