import Link from 'next/link';

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-logo">
          Movie Recommendation
        </Link>
        <nav className="app-nav">
          <Link href="/" className="app-nav-link">
            Trang chủ
          </Link>
          <Link href="/login" className="app-nav-link">
            Đăng nhập
          </Link>
          <Link href="/register" className="app-nav-link app-nav-link-primary">
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}

