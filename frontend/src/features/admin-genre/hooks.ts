import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGenre, deleteGenre, updateGenre, type CreateGenrePayload, type UpdateGenrePayload } from './api';

const GENRES_KEY = 'genres';

export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGenrePayload) => createGenre(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GENRES_KEY] });
    }
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGenrePayload }) =>
      updateGenre(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GENRES_KEY] });
    }
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GENRES_KEY] });
    }
  });
}

