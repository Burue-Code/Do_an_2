"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isLoading = register.isPending;

  function translateErrorMessage(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('unauthorized: full authentication is required to access this resource')) {
      return 'Không thể đăng ký tài khoản do lỗi xác thực hệ thống. Vui lòng thử lại sau.';
    }

    if (lower.includes('username already exists')) {
      return 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.';
    }

    if (lower.includes('user not found')) {
      return 'Không tìm thấy người dùng tương ứng.';
    }

    if (lower.includes('must not be blank')) {
      return 'Vui lòng nhập đầy đủ các trường bắt buộc.';
    }

    if (lower.includes('size must be between')) {
      if (lower.includes('username')) {
        return 'Tên đăng nhập phải có độ dài hợp lệ (ít nhất 3 ký tự).';
      }
      if (lower.includes('password')) {
        return 'Mật khẩu phải có độ dài hợp lệ (ít nhất 6 ký tự).';
      }
      if (lower.includes('full name') || lower.includes('fullname') || lower.includes('full_name')) {
        return 'Họ và tên phải có độ dài hợp lệ.';
      }
      return 'Giá trị nhập vào không đúng độ dài cho phép.';
    }

    return message;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      await register.mutateAsync({ fullName, username, password });
      router.push('/');
    } catch (e: unknown) {
      let message = 'Không thể đăng ký tài khoản. Vui lòng thử lại.';

      const error = e as AxiosError<any>;
      const data = error.response?.data;

      if (data && typeof data === 'object') {
        if ('message' in data && typeof data.message === 'string' && data.message.trim().length > 0) {
          message = data.message;
        } else if ('errors' in data && Array.isArray((data as any).errors) && (data as any).errors.length > 0) {
          const firstError = (data as any).errors[0];
          if (typeof firstError === 'string') {
            message = firstError;
          } else if (firstError && typeof firstError === 'object' && 'defaultMessage' in firstError) {
            message = String((firstError as any).defaultMessage);
          }
        }
      }

      setError(translateErrorMessage(message));
    }
  }

  return (
    <section className="auth-page">
      <h1 className="auth-title">Đăng ký tài khoản</h1>
      <p className="auth-subtitle">
        Tạo tài khoản để lưu phim yêu thích, lịch sử xem và nhận gợi ý phù hợp với bạn.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
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
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <button type="submit" className="auth-button-primary" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
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
