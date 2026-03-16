import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDirector,
  deleteDirector,
  fetchAdminDirector,
  fetchAdminDirectors,
  updateDirector,
  type CreateDirectorPayload,
  type UpdateDirectorPayload
} from './api';

const ADMIN_DIRECTORS_KEY = 'admin-directors';

export function useAdminDirectors() {
  return useQuery({
    queryKey: [ADMIN_DIRECTORS_KEY],
    queryFn: fetchAdminDirectors
  });
}

export function useAdminDirector(id: number | null) {
  return useQuery({
    queryKey: [ADMIN_DIRECTORS_KEY, id],
    queryFn: () => fetchAdminDirector(id!),
    enabled: id != null
  });
}

export function useCreateDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDirectorPayload) => createDirector(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_DIRECTORS_KEY] });
    }
  });
}

export function useUpdateDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDirectorPayload }) =>
      updateDirector(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_DIRECTORS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_DIRECTORS_KEY, variables.id] });
    }
  });
}

export function useDeleteDirector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDirector(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_DIRECTORS_KEY] });
    }
  });
}
