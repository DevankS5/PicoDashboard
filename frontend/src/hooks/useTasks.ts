import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export function useTasks(boardId?: string) {
  return useQuery<Task[]>({
    queryKey: ['tasks', boardId],
    queryFn: () =>
      api.get('/tasks', { params: boardId ? { board_id: boardId } : {} }).then((r) => r.data.data),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      api.post('/tasks', payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      api.put(`/tasks/${id}`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
