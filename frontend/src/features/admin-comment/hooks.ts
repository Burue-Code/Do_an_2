import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminComment,
  deleteReport,
  fetchAdminComments,
  fetchUnresolvedReports,
  fetchResolvedReports,
  resolveReport
} from './api';

export const ADMIN_COMMENTS_KEY = ['admin', 'comments'];
export const ADMIN_COMMENT_REPORTS_KEY = ['admin', 'comment-reports'];

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

export function useAdminComments(params: {
  movieId?: number | null;
  username?: string | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: [...ADMIN_COMMENTS_KEY, params],
    queryFn: () => fetchAdminComments(params)
    ,
    enabled: hasToken()
  });
}

export function useDeleteAdminComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminComment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY });
      qc.invalidateQueries({ queryKey: ADMIN_COMMENT_REPORTS_KEY });
    }
  });
}

export function useUnresolvedCommentReports(page = 0, size = 20) {
  return useQuery({
    queryKey: [...ADMIN_COMMENT_REPORTS_KEY, page, size],
    queryFn: () => fetchUnresolvedReports(page, size),
    enabled: hasToken()
  });
}

export function useResolvedCommentReports(page = 0, size = 20) {
  return useQuery({
    queryKey: [...ADMIN_COMMENT_REPORTS_KEY, 'resolved', page, size],
    queryFn: () => fetchResolvedReports(page, size),
    enabled: hasToken()
  });
}

export function useResolveCommentReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId: number) => resolveReport(reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_COMMENT_REPORTS_KEY });
      qc.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY });
    }
  });
}

export function useDeleteCommentReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId: number) => deleteReport(reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_COMMENT_REPORTS_KEY });
      qc.invalidateQueries({ queryKey: ADMIN_COMMENTS_KEY });
    }
  });
}

