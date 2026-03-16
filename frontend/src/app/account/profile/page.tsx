'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUpdateProfile, useUpdateFavoriteGenres, useProfileForPage, useChangePassword } from '@/features/auth/hooks';
import { useGenres } from '@/features/genre/hooks';

function toGenreIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.map((id) => (typeof id === 'number' ? id : Number(id))).filter((n) => !Number.isNaN(n));
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { data: profileData } = useProfileForPage();
  const { data: genres = [] } = useGenres();
  const updateProfile = useUpdateProfile();
  const updateFavoriteGenres = useUpdateFavoriteGenres();
  const changePasswordMutation = useChangePassword();

  const [fullName, setFullName] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [genresMessage, setGenresMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
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

  /* Ưu tiên profileData (GET /users/me); không có thì dùng user (cache) để không mất họ tên */
  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName || '');
      setSelectedGenreIds(toGenreIds(profileData.favoriteGenreIds));
      setPhone(profileData.phoneNumber ?? '');
      setEmail(profileData.email ?? '');
    } else if (user) {
      setFullName(user.fullName || '');
      setSelectedGenreIds(toGenreIds(user.favoriteGenreIds));
      setPhone((user as any).phoneNumber ?? '');
      setEmail((user as any).email ?? '');
    }
  }, [user, profileData]);

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    const trimmed = fullName.trim();
    if (!trimmed) {
      setProfileMessage('Họ tên không được để trống.');
      return;
    }
    const phoneTrimmed = phone.trim();
    if (phoneTrimmed) {
      const phoneRegex = /^(0|\+84)\d{9}$/;
      if (!phoneRegex.test(phoneTrimmed)) {
        setProfileMessage('Số điện thoại không đúng định dạng (vd: 0xxxxxxxxx hoặc +84xxxxxxxxx).');
        return;
      }
    }
    const emailTrimmed = email.trim();
    try {
      await updateProfile.mutateAsync({
        fullName: trimmed,
        phoneNumber: phoneTrimmed || null,
        email: emailTrimmed || null
      });
      setProfileMessage('Đã cập nhật thông tin.');
    } catch {
      setProfileMessage('Không thể cập nhật. Vui lòng thử lại.');
    }
  };

  const handleToggleGenre = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSubmitGenres = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenresMessage(null);
    try {
      await updateFavoriteGenres.mutateAsync(selectedGenreIds);
      setGenresMessage('Đã cập nhật thể loại yêu thích.');
    } catch {
      setGenresMessage('Không thể cập nhật. Vui lòng thử lại.');
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ oldPassword, newPassword });
      setPasswordMessage('Đã đổi mật khẩu thành công.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setPasswordMessage(msg || 'Mật khẩu hiện tại không đúng hoặc có lỗi. Vui lòng thử lại.');
    }
  };

  // Tránh hydration mismatch: server không có localStorage nên isAuthenticated khác client.
  // Chỉ render nội dung phụ thuộc auth sau khi đã mount trên client.
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
          Vui lòng <Link href="/login">đăng nhập</Link> để xem thông tin cá nhân.
        </p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <div>
          <h1>Thông tin cá nhân</h1>
          {user && <p className="account-subtitle">Xin chào, {user.fullName || user.username}</p>}
        </div>
      </header>

      <div className="account-profile-row">
        <section className="account-section">
          <dl className="account-profile-dl">
            <dt>Tên đăng nhập</dt>
            <dd>{user?.username ?? '—'}</dd>
          </dl>

          <form onSubmit={handleSubmitProfile} className="account-profile-form">
            <label className="account-profile-label" htmlFor="profile-fullName">
              Họ tên
            </label>
            <input
              id="profile-fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="account-profile-input"
              placeholder="Nhập họ tên"
              maxLength={100}
            />
            <label className="account-profile-label" htmlFor="profile-phone">
              Số điện thoại
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              className="account-profile-input"
              placeholder="Ví dụ: 0912345678 hoặc +84912345678"
              maxLength={20}
            />
            <label className="account-profile-label" htmlFor="profile-email">
              Gmail
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="account-profile-input"
              placeholder="Nhập Gmail"
              maxLength={100}
            />
            <button
              type="submit"
              className="account-profile-btn"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? 'Đang lưu...' : 'Cập nhật thông tin'}
            </button>
            {profileMessage && (
              <p className="account-profile-message">{profileMessage}</p>
            )}
          </form>
        </section>

        <section className="account-section">
          <h2 className="account-section-heading">Đổi mật khẩu</h2>
          <form onSubmit={handleSubmitPassword} className="account-profile-form">
            <label className="account-profile-label" htmlFor="profile-oldPassword">
              Mật khẩu hiện tại
            </label>
            <input
              id="profile-oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="account-profile-input"
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <label className="account-profile-label" htmlFor="profile-newPassword">
              Mật khẩu mới
            </label>
            <input
              id="profile-newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="account-profile-input"
              placeholder="Ít nhất 6 ký tự"
              required
              minLength={6}
            />
            <label className="account-profile-label" htmlFor="profile-confirmPassword">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="profile-confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="account-profile-input"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button
              type="submit"
              className="account-profile-btn"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
            {passwordMessage && (
              <p className="account-profile-message">{passwordMessage}</p>
            )}
          </form>
        </section>
      </div>

      <section className="account-section">
        <h2 className="account-section-heading">Thể loại phim yêu thích</h2>
        <p className="account-section-desc">Chọn các thể loại bạn thích để nhận gợi ý phim phù hợp hơn.</p>
        <form onSubmit={handleSubmitGenres} className="account-profile-form">
          <div className="account-genres-wrap">
            {genres.map((g) => (
              <label key={g.id} className="account-genre-chip">
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(Number(g.id))}
                  onChange={() => handleToggleGenre(Number(g.id))}
                />
                <span>{g.name}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="account-profile-btn"
            disabled={updateFavoriteGenres.isPending}
          >
            {updateFavoriteGenres.isPending ? 'Đang lưu...' : 'Cập nhật thể loại'}
          </button>
          {genresMessage && (
            <p className="account-profile-message">{genresMessage}</p>
          )}
        </form>
      </section>

      <p className="account-section-note">
        <Link href="/account/watchlist">Danh sách theo dõi</Link>
        {' · '}
        <Link href="/account/history">Lịch sử xem</Link>
      </p>
    </div>
  );
}
