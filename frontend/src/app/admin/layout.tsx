'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="admin-guard">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-guard">
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');

  if (!isAdmin) {
    return (
      <div className="admin-403">
        <h1 className="admin-403-title">403 – Không có quyền truy cập</h1>
        <p className="admin-403-text">
          Tài khoản của bạn không có quyền truy cập khu vực quản trị. Nếu bạn nghĩ đây là nhầm lẫn,
          hãy liên hệ quản trị viên hệ thống.
        </p>
        <p>
          <Link href="/" className="admin-403-link">
            Quay về trang chủ
          </Link>
        </p>
      </div>
    );
  }

  const links = [
    { href: '/admin/movies', label: 'Phim' },
    { href: '/admin/genres', label: 'Thể loại' },
    { href: '/admin/actors', label: 'Diễn viên' },
    { href: '/admin/directors', label: 'Đạo diễn' },
    { href: '/admin/users', label: 'Người dùng' },
    { href: '/admin/statistics', label: 'Thống kê' }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/" className="admin-logo">
            Movie Admin
          </Link>
        </div>
        <nav className="admin-nav">
          {links.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'admin-nav-link' + (isActive ? ' admin-nav-link-active' : '')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

