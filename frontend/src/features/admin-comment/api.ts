import { api } from '@/lib/axios';

export interface AdminCommentItem {
  id: number;
  movieId: number;
  movieTitle: string;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  unresolvedReportsCount: number;
}

export interface AdminCommentPage {
  content: AdminCommentItem[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export async function fetchAdminComments(params: {
  movieId?: number | null;
  username?: string | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}): Promise<AdminCommentPage> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 0));
  searchParams.set('size', String(params.size ?? 20));
  if (params.movieId) searchParams.set('movieId', String(params.movieId));
  if (params.username?.trim()) searchParams.set('username', params.username.trim());
  if (params.keyword?.trim()) searchParams.set('keyword', params.keyword.trim());
  const { data } = await api.get<AdminCommentPage>(`/admin/comments?${searchParams.toString()}`);
  return data;
}

export async function deleteAdminComment(id: number): Promise<void> {
  await api.delete(`/admin/comments/${id}`);
}

export interface AdminCommentReportItem {
  reportId: number;
  commentId: number;
  movieId: number;
  movieTitle: string;
  commentUserId: number;
  commentUsername: string;
  commentContent: string;
  commentCreatedAt: string;
  reporterUserId: number;
  reporterUsername: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
}

export interface AdminCommentReportPage {
  content: AdminCommentReportItem[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export async function fetchUnresolvedReports(page = 0, size = 20): Promise<AdminCommentReportPage> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  const { data } = await api.get<AdminCommentReportPage>(`/admin/comments/reports?${searchParams.toString()}`);
  return data;
}

export async function fetchResolvedReports(page = 0, size = 20): Promise<AdminCommentReportPage> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  const { data } = await api.get<AdminCommentReportPage>(`/admin/comments/reports/resolved?${searchParams.toString()}`);
  return data;
}

export async function resolveReport(reportId: number): Promise<void> {
  await api.put(`/admin/comments/reports/${reportId}/resolve`);
}

export async function deleteReport(reportId: number): Promise<void> {
  await api.delete(`/admin/comments/reports/${reportId}`);
}

