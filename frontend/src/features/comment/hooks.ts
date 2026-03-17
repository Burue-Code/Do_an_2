import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, fetchComments, reportComment, type CreateCommentPayload } from './api';
import type { CommentPage } from './types';

const COMMENTS_KEY = 'comments';

export function useComments(movieId: number, page = 0, size = 20) {
  return useQuery<CommentPage>({
    queryKey: [COMMENTS_KEY, movieId, page, size],
    queryFn: () => fetchComments(movieId, page, size),
    enabled: Number.isFinite(movieId) && movieId > 0
  });
}

export function useCreateComment(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(movieId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMENTS_KEY, movieId]
      });
    }
  });
}

export function useReportComment() {
  return useMutation({
    mutationFn: ({ commentId, reason }: { commentId: number; reason: string }) =>
      reportComment(commentId, { reason })
  });
}

