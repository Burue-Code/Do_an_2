'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useGenres } from '@/features/genre/hooks';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '@/features/movie/api';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: genres = [] } = useGenres();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults } = useQuery({
    queryKey: ['movies', 'search', searchQuery.trim().slice(0, 50)],
    queryFn: () => fetchMovies({ keyword: searchQuery.trim(), size: 8 }),
    enabled: searchQuery.trim().length >= 2
  });
  const showSearchSuggestions = searchFocused && searchQuery.trim().length >= 2 && (searchResults?.content?.length ?? 0) > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (genreRef.current && !genreRef.current.contains(target)) setGenreOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(target)) setSearchFocused(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/movies?keyword=${encodeURIComponent(q)}`);
    setSearchQuery('');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          MOVIE RECOMMENDATION
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Trang chủ
          </Link>

          <div className={styles.dropdown} ref={genreRef}>
            <button
              type="button"
              className={styles.navLink}
              onClick={() => setGenreOpen((o) => !o)}
              aria-expanded={genreOpen}
            >
              Thể loại ▾
            </button>
            {genreOpen && (
              <div className={styles.dropdownMenu}>
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/movies?genreId=${g.id}`}
                    className={styles.dropdownItem}
                    onClick={() => setGenreOpen(false)}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/movies?menu=phim-le" className={styles.navLink}>
            Phim lẻ
          </Link>
          <Link href="/movies?menu=phim-bo" className={styles.navLink}>
            Phim bộ
          </Link>
          <Link href="/movies?menu=phim-moi" className={styles.navLink}>
            Phim mới
          </Link>
          <Link href="/movies?menu=top-phim" className={styles.navLink}>
            Top phim
          </Link>
        </nav>

        <div className={styles.searchWrap} ref={searchRef}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Tìm phim, diễn viên..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              aria-label="Tìm kiếm"
              aria-autocomplete="list"
              aria-expanded={showSearchSuggestions}
            />
            <button type="submit" className={styles.searchBtn} aria-label="Tìm">
              Tìm
            </button>
          </form>
          {showSearchSuggestions && (
            <ul className={styles.searchSuggestions} role="listbox">
              {searchResults!.content.map((m) => (
                <li key={m.id} role="option">
                  <Link
                    href={`/movies/${m.id}`}
                    className={styles.suggestionItem}
                    onClick={() => { setSearchQuery(''); setSearchFocused(false); }}
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.right}>
          {isAuthenticated && user ? (
            <div className={styles.dropdown} ref={userMenuRef}>
              <button
                type="button"
                className={styles.userButton}
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
              >
                {user.fullName || user.username} ▾
              </button>
              {userMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <span className={styles.dropdownItemStatic}>{user.username}</span>
                  {user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' ? (
                    <Link
                      href="/admin/statistics"
                      className={styles.dropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Trang quản lý
                    </Link>
                  ) : null}
                  <Link
                    href="/account/watchlist#danh-sach-theo-doi"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Danh sách theo dõi
                  </Link>
                  <Link
                    href="/account/watchlist"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Lịch sử xem
                  </Link>
                  <Link
                    href="/account/profile"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Đăng nhập
              </Link>
              <Link href="/register" className={`${styles.navLink} ${styles.navLinkPrimary}`}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
