import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsers, lockUser, unlockUser, changeUserRole } from './api';
import type { AdminUser } from './types';

const ADMIN_USERS_KEY = 'admin-users';

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: [ADMIN_USERS_KEY],
    queryFn: fetchAdminUsers
  });
}

export function useLockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
    }
  });
}

export function useUnlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
    }
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'ROLE_ADMIN' | 'ROLE_USER' }) =>
      changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_KEY] });
    }
  });
}

