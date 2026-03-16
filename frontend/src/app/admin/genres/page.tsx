'use client';

import { useCallback, useEffect, useState } from 'react';
import { useGenres } from '@/features/genre/hooks';
import { useCreateGenre, useDeleteGenre, useUpdateGenre } from '@/features/admin-genre/hooks';

export default function AdminGenresPage() {
  const { data: genres, isLoading, isError, error } = useGenres();
  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const deleteMutation = useDeleteGenre();

  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      showToast('Vui lòng nhập tên thể loại.', 'error');
      return;
    }
    if (trimmed.length < 2) {
      showToast('Tên thể loại cần ít nhất 2 ký tự.', 'error');
      return;
    }

    if (editingId != null) {
      updateMutation.mutate(
        { id: editingId, payload: { name: trimmed } },
        {
          onSuccess: () => {
            setEditingId(null);
            setName('');
            showToast('Đã cập nhật thể loại.', 'success');
          },
          onError: (err) =>
            showToast((err as Error)?.message ?? 'Cập nhật thể loại thất bại.', 'error')
        }
      );
    } else {
      createMutation.mutate(
        { name: trimmed },
        {
          onSuccess: () => {
            setName('');
            showToast('Đã thêm thể loại.', 'success');
          },
          onError: (err) =>
            showToast((err as Error)?.message ?? 'Thêm thể loại thất bại.', 'error')
        }
      );
    }
  };

  const startEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý thể loại</h1>
        <p>Thêm, chỉnh sửa và xóa thể loại phim.</p>
      </header>

      {toast && (
        <div
          className={`admin-toast admin-toast-fixed ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">
          {editingId != null ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên thể loại"
            className="admin-input"
          />
          <div className="admin-form-submit-row">
            <button
              type="submit"
              className="admin-button-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingId != null
                ? updateMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu thay đổi'
                : createMutation.isPending
                  ? 'Đang thêm...'
                  : 'Thêm thể loại'}
            </button>
            {editingId != null && (
              <button
                type="button"
                className="admin-button-secondary"
                onClick={cancelEdit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách thể loại</h2>
        {isLoading && <p>Đang tải danh sách thể loại...</p>}
        {isError && (
          <p>
            Không thể tải danh sách thể loại.{' '}
            {(error as Error)?.message ?? 'Vui lòng kiểm tra lại kết nối và backend.'}
          </p>
        )}
        {!isLoading && !isError && genres && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.name}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      onClick={() => startEdit(g.id, g.name)}
                      className="admin-table-button"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm('Bạn có chắc muốn xóa thể loại này?')) return;
                        deleteMutation.mutate(g.id, {
                          onSuccess: () => showToast('Đã xóa thể loại.', 'success'),
                          onError: (err) =>
                            showToast((err as Error)?.message ?? 'Xóa thể loại thất bại.', 'error')
                        });
                      }}
                      className="admin-table-button admin-table-button-danger"
                      disabled={deleteMutation.isPending}
                    >
                      Xóa
                    </button>
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

