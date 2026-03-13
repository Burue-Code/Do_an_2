import Link from 'next/link';

export default function RegisterPage() {
  return (
    <section className="auth-page">
      <h1 className="auth-title">Đăng ký tài khoản</h1>
      <p className="auth-subtitle">
        Tạo tài khoản để lưu phim yêu thích, lịch sử xem và nhận gợi ý phù hợp với bạn.
      </p>

      <form className="auth-form">
        <div className="auth-field">
          <label htmlFor="fullName" className="auth-label">
            Họ và tên
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="auth-input"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="username" className="auth-label">
            Tên đăng nhập
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
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="auth-input"
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <div className="auth-actions">
          <button type="submit" className="auth-button-primary">
            Đăng ký
          </button>
          <p className="auth-meta">
            Đã có tài khoản?{' '}
            <Link href="/login" className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}

