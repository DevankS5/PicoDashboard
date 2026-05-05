import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Agent } from '../types';

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
