import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsers, lockUser, unlockUser } from './api';
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

