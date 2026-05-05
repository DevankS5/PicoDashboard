import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Task } from '../types';

export function useApprovals() {
  return useQuery<Task[]>({
    queryKey: ['approvals'],
    queryFn: () => api.get('/approvals').then((r) => r.data.data),
    refetchInterval: 30 * 1000,
  });
}

export function useResolveApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      action,
    }: {
      taskId: string;
      action: 'approve' | 'reject';
    }) =>
      api
        .post(`/approvals/${taskId}/resolve`, { action })
        .then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
