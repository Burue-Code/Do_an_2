import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createActor,
  deleteActor,
  fetchAdminActor,
  fetchAdminActors,
  updateActor,
  type CreateActorPayload,
  type UpdateActorPayload
} from './api';

const ADMIN_ACTORS_KEY = 'admin-actors';

export function useAdminActors() {
  return useQuery({
    queryKey: [ADMIN_ACTORS_KEY],
    queryFn: fetchAdminActors
  });
}

export function useAdminActor(id: number | null) {
  return useQuery({
    queryKey: [ADMIN_ACTORS_KEY, id],
    queryFn: () => fetchAdminActor(id!),
    enabled: id != null
  });
}

export function useCreateActor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateActorPayload) => createActor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ACTORS_KEY] });
    }
  });
}

export function useUpdateActor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateActorPayload }) =>
      updateActor(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ACTORS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_ACTORS_KEY, variables.id] });
    }
  });
}

export function useDeleteActor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteActor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ACTORS_KEY] });
    }
  });
}
