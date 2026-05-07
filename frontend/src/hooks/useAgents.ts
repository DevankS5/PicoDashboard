import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Agent, CreateAgentPayload } from '../types';

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: () => api.get('/agents').then((r) => r.data.data),
    refetchInterval: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRefreshAgents() {
  const queryClient = useQueryClient();
  return () => {
    api.post('/agents/health-check').then(() => {
      // Small delay so DB writes from the health check are visible before re-fetch
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['agents'] });
      }, 500);
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

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => api.delete(`/agents/${agentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
