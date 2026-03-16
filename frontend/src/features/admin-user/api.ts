import { api } from '@/lib/axios';
import type { AdminUser } from './types';

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/admin/users');
  return data;
}

export async function lockUser(id: number): Promise<void> {
  await api.patch<void>(`/admin/users/${id}/lock`);
}

export async function unlockUser(id: number): Promise<void> {
  await api.patch<void>(`/admin/users/${id}/unlock`);
}

export async function changeUserRole(id: number, role: 'ROLE_ADMIN' | 'ROLE_USER'): Promise<void> {
  await api.patch<void>(`/admin/users/${id}/role`, { role });
}

