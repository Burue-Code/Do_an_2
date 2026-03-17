import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AdminScheduleItem,
  AdminSchedulePayload,
  createAdminSchedule,
  deleteAdminSchedule,
  fetchAdminSchedules,
  updateAdminSchedule
} from './api';

const ADMIN_SCHEDULES_KEY = ['admin', 'schedules'];

export function useAdminSchedules() {
  return useQuery<AdminScheduleItem[]>({
    queryKey: ADMIN_SCHEDULES_KEY,
    queryFn: fetchAdminSchedules
  });
}

export function useCreateAdminSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminSchedulePayload) => createAdminSchedule(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SCHEDULES_KEY });
    }
  });
}

export function useUpdateAdminSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: number; payload: AdminSchedulePayload }) =>
      updateAdminSchedule(params.id, params.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SCHEDULES_KEY });
    }
  });
}

export function useDeleteAdminSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminSchedule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SCHEDULES_KEY });
    }
  });
}

