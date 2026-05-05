import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Board } from '../types';

export function useBoards() {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => api.get('/boards').then((r) => r.data.data),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api.post('/boards', { name }).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}
