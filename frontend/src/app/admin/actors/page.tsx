'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  useAdminActors,
  useCreateActor,
  useDeleteActor,
  useUpdateActor
} from '@/features/admin-actor/hooks';
import type { AdminActor, CreateActorPayload, UpdateActorPayload } from '@/features/admin-actor/types';

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
    const msg = (err.response.data as { message?: string }).message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return (err as Error)?.message ?? fallback;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

export default function AdminActorsPage() {
  const { data: actors, isLoading, isError, error } = useAdminActors();
  const createMutation = useCreateActor();
  const updateMutation = useUpdateActor();
  const deleteMutation = useDeleteActor();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateActorPayload>({
    fullName: '',
    gender: '',
    birthDate: '',
    nationality: '',
    biography: '',
    imageUrl: ''
  });

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm({
      fullName: '',
      gender: '',
      birthDate: '',
      nationality: '',
      biography: '',
      imageUrl: ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = form.fullName.trim();
    if (!trimmedName) {
      showToast('Vui lòng nhập họ tên diễn viên.', 'error');
      return;
    }
    if (trimmedName.length < 2) {
      showToast('Họ tên cần ít nhất 2 ký tự.', 'error');
      return;
    }

    const payload: CreateActorPayload & UpdateActorPayload = {
      fullName: trimmedName,
      gender: form.gender || null,
      birthDate: form.birthDate || null,
      nationality: form.nationality || null,
      biography: form.biography || null,
      imageUrl: form.imageUrl || null
    };

    if (editingId != null) {
      updateMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            resetForm();
            showToast('Đã cập nhật diễn viên.', 'success');
          },
          onError: (err) =>
            showToast(getErrorMessage(err, 'Cập nhật diễn viên thất bại.'), 'error')
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          showToast('Đã thêm diễn viên.', 'success');
        },
        onError: (err) =>
          showToast(getErrorMessage(err, 'Thêm diễn viên thất bại.'), 'error')
      });
    }
  };

  const startEdit = (a: AdminActor) => {
    setEditingId(a.id);
    setForm({
      fullName: a.fullName,
      gender: a.gender ?? '',
      birthDate: a.birthDate ? a.birthDate.slice(0, 10) : '',
      nationality: a.nationality ?? '',
      biography: a.biography ?? '',
      imageUrl: a.imageUrl ?? ''
    });
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleDelete = (a: AdminActor) => {
    if (!confirm(`Bạn có chắc muốn xóa diễn viên "${a.fullName}"?`)) return;
    deleteMutation.mutate(a.id, {
      onSuccess: () => showToast('Đã xóa diễn viên.', 'success'),
      onError: (err) =>
        showToast(getErrorMessage(err, 'Xóa diễn viên thất bại.'), 'error')
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý diễn viên</h1>
        <p>Thêm, chỉnh sửa và xóa diễn viên. Diễn viên đang gán vào phim không thể xóa.</p>
      </header>

      {toast && (
        <div
          role="alert"
          className={`admin-toast admin-toast-fixed ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}
        >
          {toast.message}
        </div>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">
          {editingId != null ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên mới'}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form admin-form-grid">
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Họ tên <span aria-hidden>*</span></label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Ví dụ: Tom Hanks"
              className="admin-input"
              maxLength={200}
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Giới tính</label>
            <input
              type="text"
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              placeholder="Nam / Nữ / Khác"
              className="admin-input"
              maxLength={20}
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Ngày sinh</label>
            <input
              type="date"
              value={form.birthDate ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value || null }))}
              className="admin-input"
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Quốc tịch</label>
            <input
              type="text"
              value={form.nationality ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value || null }))}
              placeholder="Ví dụ: Mỹ"
              className="admin-input"
              maxLength={100}
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Tiểu sử</label>
            <textarea
              value={form.biography ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value || null }))}
              placeholder="Mô tả ngắn về diễn viên"
              className="admin-input admin-textarea"
              rows={3}
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">URL ảnh</label>
            <input
              type="text"
              value={form.imageUrl ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value || null }))}
              placeholder="https://..."
              className="admin-input"
              maxLength={500}
            />
          </div>
          <div className="admin-form-submit-row">
            <button
              type="submit"
              className="admin-button-primary"
              disabled={isPending}
            >
              {editingId != null
                ? updateMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu thay đổi'
                : createMutation.isPending
                  ? 'Đang thêm...'
                  : 'Thêm diễn viên'}
            </button>
            {editingId != null && (
              <button
                type="button"
                className="admin-button-secondary"
                onClick={resetForm}
                disabled={isPending}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Danh sách diễn viên</h2>
        {isLoading && <p>Đang tải danh sách diễn viên...</p>}
        {isError && (
          <p>
            Không thể tải danh sách.{' '}
            {getErrorMessage(error, 'Vui lòng kiểm tra lại kết nối và backend.')}
          </p>
        )}
        {!isLoading && !isError && actors && (
          <>
            {actors.length > 0 && (
              <div className="admin-form-field admin-form-field-full" style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm diễn viên trong danh sách..."
                  className="admin-input"
                  aria-label="Tìm diễn viên"
                />
              </div>
            )}
            {actors.length === 0 ? (
              <p className="admin-empty-message">Chưa có diễn viên nào. Hãy thêm diễn viên bằng form phía trên.</p>
            ) : (() => {
              const q = searchQuery.trim().toLowerCase();
              const filtered = q
                ? actors.filter(
                    (a) =>
                      a.fullName.toLowerCase().includes(q) ||
                      (a.nationality?.toLowerCase().includes(q) ?? false) ||
                      (a.gender?.toLowerCase().includes(q) ?? false)
                  )
                : actors;
              if (filtered.length === 0) {
                return (
                  <p className="admin-empty-message">
                    Không tìm thấy diễn viên nào phù hợp với &quot;{searchQuery.trim()}&quot;.
                  </p>
                );
              }
              return (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Quốc tịch</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.fullName}</td>
                      <td>{a.gender ?? '—'}</td>
                      <td>{formatDate(a.birthDate)}</td>
                      <td>{a.nationality ?? '—'}</td>
                      <td className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-table-button"
                          onClick={() => startEdit(a)}
                          disabled={deleteMutation.isPending}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="admin-table-button admin-table-button-danger"
                          onClick={() => handleDelete(a)}
                          disabled={deleteMutation.isPending}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              );
            })()}
          </>
        )}
      </section>
    </div>
  );
}
