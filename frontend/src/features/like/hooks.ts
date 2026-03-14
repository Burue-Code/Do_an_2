import { useMutation } from '@tanstack/react-query';
import { toggleLike } from './api';
import type { ToggleLikeResponse } from './types';

export function useToggleLike(movieId: number) {
  return useMutation<ToggleLikeResponse, Error, void>({
    mutationFn: () => toggleLike(movieId)
  });
}

