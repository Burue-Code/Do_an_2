import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import * as api from './api';
import type { LoginParams, RegisterParams } from './api';

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

export function useLogout() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    queryClient.setQueryData(AUTH_ME_KEY, null);
    queryClient.clear();
  }, [queryClient]);
}
