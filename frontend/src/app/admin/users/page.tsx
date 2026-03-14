'use client';

import { useAdminUsers, useLockUser, useUnlockUser } from '@/features/admin-user/hooks';

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, error } = useAdminUsers();
  const lockMutation = useLockUser();
  const unlockMutation = useUnlockUser();

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
            {(error as Error)?.message ?? 'Vui lòng kiểm tra lại kết nối và backend.'}
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
                    {u.locked ? (
                      <button
                        type="button"
                        className="admin-table-button"
                        onClick={() => unlockMutation.mutate(u.id)}
                      >
                        Mở khóa
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-table-button admin-table-button-danger"
                        onClick={() => lockMutation.mutate(u.id)}
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
    </div>
  );
}

