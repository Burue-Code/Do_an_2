"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isLoading = login.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const auth = await login.mutateAsync({ username, password });
      const role = auth.user.role;
      if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
        router.push('/admin/statistics');
      } else {
        router.push('/');
      }
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { message?: string } } };
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 403 && msg) {
        setError(msg);
      } else if (typeof msg === 'string' && msg.length > 0) {
        setError(msg);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    }
  }

  return (
    <section className="auth-page">
      <h1 className="auth-title">Đăng nhập</h1>
      <p className="auth-subtitle">
        Truy cập hệ thống gợi ý phim theo thể loại bằng tài khoản của bạn.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <button type="submit" className="auth-button-primary" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
