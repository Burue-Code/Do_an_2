'use client';

import { useState } from 'react';
import { useGenres } from '@/features/genre/hooks';
import { useCreateGenre, useDeleteGenre, useUpdateGenre } from '@/features/admin-genre/hooks';

export default function AdminGenresPage() {
  const { data: genres, isLoading, isError, error } = useGenres();
  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const deleteMutation = useDeleteGenre();

  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId != null) {
      updateMutation.mutate({ id: editingId, payload: { name: name.trim() } }, {
        onSuccess: () => {
          setEditingId(null);
          setName('');
        }
      });
    } else {
      createMutation.mutate({ name: name.trim() }, {
        onSuccess: () => {
          setName('');
        }
      });
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
          <div className="admin-form-actions">
            <button type="submit" className="auth-button-primary">
              {editingId != null ? 'Lưu thay đổi' : 'Thêm thể loại'}
            </button>
            {editingId != null && (
              <button type="button" className="auth-button-secondary" onClick={cancelEdit}>
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
                      onClick={() => deleteMutation.mutate(g.id)}
                      className="admin-table-button admin-table-button-danger"
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

