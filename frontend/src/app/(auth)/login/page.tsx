import Link from 'next/link';

export default function LoginPage() {
  return (
    <section className="auth-page">
      <h1 className="auth-title">Đăng nhập</h1>
      <p className="auth-subtitle">
        Truy cập hệ thống gợi ý phim theo thể loại bằng tài khoản của bạn.
      </p>

      <form className="auth-form">
        <div className="auth-field">
          <label htmlFor="username" className="auth-label">
            Tên đăng nhập hoặc email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="auth-input"
            autoComplete="username"
            placeholder="nguyenvana"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="auth-input"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <div className="auth-actions">
          <button type="submit" className="auth-button-primary">
            Đăng nhập
          </button>
          <p className="auth-meta">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="auth-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}

