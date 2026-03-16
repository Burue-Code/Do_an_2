'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  useAdminDirectors,
  useCreateDirector,
  useDeleteDirector,
  useUpdateDirector
} from '@/features/admin-director/hooks';
import type { AdminDirector, CreateDirectorPayload, UpdateDirectorPayload } from '@/features/admin-director/types';

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

export default function AdminDirectorsPage() {
  const { data: directors, isLoading, isError, error } = useAdminDirectors();
  const createMutation = useCreateDirector();
  const updateMutation = useUpdateDirector();
  const deleteMutation = useDeleteDirector();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateDirectorPayload>({
    fullName: '',
    birthDate: '',
    awards: '',
    biography: ''
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
      birthDate: '',
      awards: '',
      biography: ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = form.fullName.trim();
    if (!trimmedName) {
      showToast('Vui lòng nhập họ tên đạo diễn.', 'error');
      return;
    }
    if (trimmedName.length < 2) {
      showToast('Họ tên cần ít nhất 2 ký tự.', 'error');
      return;
    }

    const payload: CreateDirectorPayload & UpdateDirectorPayload = {
      fullName: trimmedName,
      birthDate: form.birthDate || null,
      awards: form.awards || null,
      biography: form.biography || null
    };

    if (editingId != null) {
      updateMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            resetForm();
            showToast('Đã cập nhật đạo diễn.', 'success');
          },
          onError: (err) =>
            showToast(getErrorMessage(err, 'Cập nhật đạo diễn thất bại.'), 'error')
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          showToast('Đã thêm đạo diễn.', 'success');
        },
        onError: (err) =>
          showToast(getErrorMessage(err, 'Thêm đạo diễn thất bại.'), 'error')
      });
    }
  };

  const startEdit = (d: AdminDirector) => {
    setEditingId(d.id);
    setForm({
      fullName: d.fullName,
      birthDate: d.birthDate ? d.birthDate.slice(0, 10) : '',
      awards: d.awards ?? '',
      biography: d.biography ?? ''
    });
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleDelete = (d: AdminDirector) => {
    if (!confirm(`Bạn có chắc muốn xóa đạo diễn "${d.fullName}"?`)) return;
    deleteMutation.mutate(d.id, {
      onSuccess: () => showToast('Đã xóa đạo diễn.', 'success'),
      onError: (err) =>
        showToast(getErrorMessage(err, 'Xóa đạo diễn thất bại.'), 'error')
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <header className="admin-page-header">
        <h1>Quản lý đạo diễn</h1>
        <p>Thêm, chỉnh sửa và xóa đạo diễn. Đạo diễn đang gán vào phim không thể xóa.</p>
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
          {editingId != null ? 'Chỉnh sửa đạo diễn' : 'Thêm đạo diễn mới'}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form admin-form-grid">
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Họ tên <span aria-hidden>*</span></label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Ví dụ: Christopher Nolan"
              className="admin-input"
              maxLength={200}
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
            <label className="admin-form-label">Giải thưởng</label>
            <textarea
              value={form.awards ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, awards: e.target.value || null }))}
              placeholder="Các giải thưởng đã nhận"
              className="admin-input admin-textarea"
              rows={2}
            />
          </div>
          <div className="admin-form-field admin-form-field-full">
            <label className="admin-form-label">Tiểu sử</label>
            <textarea
              value={form.biography ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value || null }))}
              placeholder="Mô tả ngắn về đạo diễn"
              className="admin-input admin-textarea"
              rows={3}
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
                  : 'Thêm đạo diễn'}
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
        <h2 className="admin-section-title">Danh sách đạo diễn</h2>
        {isLoading && <p>Đang tải danh sách đạo diễn...</p>}
        {isError && (
          <p>
            Không thể tải danh sách.{' '}
            {getErrorMessage(error, 'Vui lòng kiểm tra lại kết nối và backend.')}
          </p>
        )}
        {!isLoading && !isError && directors && (
          <>
            {directors.length > 0 && (
              <div className="admin-form-field admin-form-field-full" style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm đạo diễn trong danh sách..."
                  className="admin-input"
                  aria-label="Tìm đạo diễn"
                />
              </div>
            )}
            {directors.length === 0 ? (
              <p className="admin-empty-message">Chưa có đạo diễn nào. Hãy thêm đạo diễn bằng form phía trên.</p>
            ) : (() => {
              const q = searchQuery.trim().toLowerCase();
              const filtered = q
                ? directors.filter(
                    (d) =>
                      d.fullName.toLowerCase().includes(q) ||
                      (d.awards?.toLowerCase().includes(q) ?? false) ||
                      (d.biography?.toLowerCase().includes(q) ?? false)
                  )
                : directors;
              if (filtered.length === 0) {
                return (
                  <p className="admin-empty-message">
                    Không tìm thấy đạo diễn nào phù hợp với &quot;{searchQuery.trim()}&quot;.
                  </p>
                );
              }
              return (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ tên</th>
                      <th>Ngày sinh</th>
                      <th>Giải thưởng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.fullName}</td>
                        <td>{formatDate(d.birthDate)}</td>
                        <td>{d.awards ? (d.awards.length > 50 ? d.awards.slice(0, 50) + '…' : d.awards) : '—'}</td>
                        <td className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-table-button"
                            onClick={() => startEdit(d)}
                            disabled={deleteMutation.isPending}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table-button admin-table-button-danger"
                            onClick={() => handleDelete(d)}
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
