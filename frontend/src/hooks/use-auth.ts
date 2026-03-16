import { useAuthMe, useLogin, useLogout, useRegister } from '@/features/auth/hooks';

/** Re-export auth hooks theo tech_stack.md */
export function useAuth() {
  const { data: user, isLoading, isError } = useAuthMe();
  const login = useLogin();
  const logout = useLogout();
  const register = useRegister();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError,
    login,
    logout,
    register
  };
}
