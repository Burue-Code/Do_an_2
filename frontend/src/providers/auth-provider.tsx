'use client';

import { useAuthMe } from '@/features/auth/hooks';
import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextValue {
  user: ReturnType<typeof useAuthMe>['data'] | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useAuthMe();

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
