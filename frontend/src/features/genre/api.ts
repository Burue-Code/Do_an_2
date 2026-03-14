import { api } from '@/lib/axios';
import type { Genre } from './types';

export async function fetchGenres(): Promise<Genre[]> {
  const { data } = await api.get<Genre[]>('/genres');
  return data;
}
