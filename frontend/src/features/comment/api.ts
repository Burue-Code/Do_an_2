import { api } from '@/lib/axios';
import type { Comment, CommentPage } from './types';

export async function fetchComments(
  movieId: number,
  page = 0,
  size = 20
): Promise<CommentPage> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));

  const { data } = await api.get<CommentPage>(
    `/movies/${movieId}/comments?${searchParams.toString()}`
  );
  return data;
}

export interface CreateCommentPayload {
  content: string;
}

export async function createComment(
  movieId: number,
  payload: CreateCommentPayload
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/movies/${movieId}/comments`, payload);
  return data;
}

