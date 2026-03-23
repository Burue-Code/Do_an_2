import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import * as api from './api';
import type { ChangePasswordParams, LoginParams, RegisterParams, UpdateProfileParams } from './api';

const AUTH_ME_KEY = ['auth', 'me'] as const;

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function useAuthMe() {
  const hasToken = !!getStoredToken();
  return useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: api.fetchMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: LoginParams) => api.login(params),
    onSuccess: (auth) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', auth.accessToken);
      }
      queryClient.setQueryData(AUTH_ME_KEY, auth.user);
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: RegisterParams) => api.register(params),
    onSuccess: (auth) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', auth.accessToken);
      }
      queryClient.setQueryData(AUTH_ME_KEY, auth.user);
    }
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => api.updateProfile(params),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_ME_KEY, user);
    }
  });
}

/** Profile đầy đủ (có favoriteGenreIds) — dùng GET /auth/me, refetch khi vào trang profile */
export function useProfileForPage() {
  const hasToken = !!getStoredToken();
  return useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: api.fetchMe,
    enabled: hasToken,
    refetchOnMount: 'always',
    staleTime: 0
  });
}

export function useUpdateFavoriteGenres() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (genreIds: number[]) => api.updateFavoriteGenres(genreIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ME_KEY });
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordParams) => api.changePassword(params)
  });
}

const GENRE_ONBOARDING_DISMISS_PREFIX = 'genreOnboarding:dismissed:';

export function clearGenreOnboardingDismissForUser(userId: number) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${GENRE_ONBOARDING_DISMISS_PREFIX}${userId}`);
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    if (typeof window !== 'undefined') {
      const me = queryClient.getQueryData(AUTH_ME_KEY) as { id?: number } | null | undefined;
      if (me?.id != null) {
        clearGenreOnboardingDismissForUser(me.id);
      }
      localStorage.removeItem('accessToken');
    }
    queryClient.setQueryData(AUTH_ME_KEY, null);
    queryClient.clear();
  }, [queryClient]);
}
