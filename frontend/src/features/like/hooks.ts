import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLikeStatus, toggleLike } from './api';
import type { ToggleLikeResponse } from './types';

const LIKE_STATUS_KEY = 'movie-like';

export function useLikeStatus(movieId: number, enabled = true) {
  return useQuery<ToggleLikeResponse>({
    queryKey: [LIKE_STATUS_KEY, movieId],
    queryFn: () => getLikeStatus(movieId),
    enabled: enabled && movieId != null
  });
}

export function useToggleLike(movieId: number) {
  const queryClient = useQueryClient();
  return useMutation<ToggleLikeResponse, Error, void>({
    mutationFn: () => toggleLike(movieId),
    onSuccess: (data) => {
      queryClient.setQueryData<ToggleLikeResponse>([LIKE_STATUS_KEY, movieId], data);
    }
  });
}

