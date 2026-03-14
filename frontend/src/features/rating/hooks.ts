import { useMutation } from '@tanstack/react-query';
import { rateMovie } from './api';
import type { RatingSummary } from './types';

export function useRateMovie(movieId: number) {
  return useMutation<RatingSummary, Error, number>({
    mutationFn: (value: number) => rateMovie(movieId, value)
  });
}

