import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Agent, CreateAgentPayload } from '../types';

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: () => api.get('/agents').then((r) => r.data.data),
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useRefreshAgents() {
  const queryClient = useQueryClient();
  return () => {
    api.post('/agents/health-check').finally(() => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    });
  };
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAgentPayload) =>
      api.post('/agents', payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
