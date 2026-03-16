'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { useAdminUsers, useLockUser, useUnlockUser, useChangeUserRole } from '@/features/admin-user/hooks';
import type { AdminUser } from '@/features/admin-user/types';

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
    const msg = (err.response.data as { message?: string }).message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return (err as Error)?.message ?? fallback;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, isError, error } = useAdminUsers();
  const lockMutation = useLockUser();
  const unlockMutation = useUnlockUser();
  const changeRoleMutation = useChangeUserRole();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLock = (u: AdminUser) => {
    if (!confirm(`Bạn có chắc muốn khóa tài khoản "${u.username}"?`)) return;
    lockMutation.mutate(u.id, {
      onSuccess: () => showToast('Đã khóa tài khoản.', 'success'),
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
          showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
          router.push('/login');
        } else {
          showToast((err as Error)?.message ?? 'Khóa tài khoản thất bại.', 'error');
        }
      }
    });
  };

  const handleUnlock = (u: AdminUser) => {
    if (!confirm(`Bạn có chắc muốn mở khóa tài khoản "${u.username}"?`)) return;
    unlockMutation.mutate(u.id, {
      onSuccess: () => showToast('Đã mở khóa tài khoản.', 'success'),
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
          showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
          router.push('/login');
        } else {
          showToast(getErrorMessage(err, 'Mở khóa tài khoản thất bại.'), 'error');
        }
      }
    });
  };

  const isAdminRole = (role: string) =>
    role === 'ROLE_ADMIN' || role === 'ADMIN';

  const handleChangeRole = (u: AdminUser) => {
    const newRole = isAdminRole(u.role) ? 'ROLE_USER' : 'ROLE_ADMIN';
    const action = newRole === 'ROLE_ADMIN' ? 'cấp quyền Admin cho' : 'chuyển thành User';
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản "${u.username}"?`)) return;
    changeRoleMutation.mutate(
      { id: u.id, role: newRole },
      {
        onSuccess: () =>
          showToast(newRole === 'ROLE_ADMIN' ? 'Đã chuyển thành Admin.' : 'Đã chuyển thành User.', 'success'),
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
            showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
            router.push('/login');
          } else {
            showToast(getErrorMessage(err, 'Đổi quyền thất bại.'), 'error');
          }
        }
      }
    );
  };

  const isCurrentUser = (u: AdminUser) => currentUser && currentUser.id != null && u.id === currentUser.id;

  const lockPending = lockMutation.isPending;
  const unlockPending = unlockMutation.isPending;
  const rolePending = changeRoleMutation.isPending;

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý người dùng</h1>
        <p>Xem danh sách tài khoản và khóa/mở khóa khi cần thiết.</p>
      </header>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách người dùng</h2>

        {isLoading && <p>Đang tải danh sách người dùng...</p>}
        {isError && (
          <p>
            Không thể tải danh sách người dùng.{' '}
            {getErrorMessage(error, 'Vui lòng kiểm tra lại kết nối và backend.')}
          </p>
        )}

        {!isLoading && !isError && users && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Role</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td>{u.locked ? 'Đã khóa' : 'Hoạt động'}</td>
                  <td className="admin-table-actions">
                    {!isCurrentUser(u) ? (
                      <button
                        type="button"
                        className="admin-table-button"
                        onClick={() => handleChangeRole(u)}
                        disabled={rolePending}
                        title={isAdminRole(u.role) ? 'Chuyển thành User' : 'Chuyển thành Admin'}
                      >
                        {isAdminRole(u.role) ? '→ User' : '→ Admin'}
                      </button>
                    ) : (
                      <span className="admin-table-muted" title="Không thể đổi quyền chính mình">—</span>
                    )}
                    {u.locked ? (
                      <button
                        type="button"
                        className="admin-table-button"
                        onClick={() => handleUnlock(u)}
                        disabled={unlockPending}
                      >
                        Mở khóa
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-table-button admin-table-button-danger"
                        onClick={() => handleLock(u)}
                        disabled={lockPending}
                      >
                        Khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {toast && (
        <div
          role="alert"
          className={`admin-toast admin-toast-fixed ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

