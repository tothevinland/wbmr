import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { SearchResponse } from '@/lib/schemas';

export function useSearch(query: string, limit = 5) {
  return useQuery<SearchResponse>({
    queryKey: ['search', query, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return data;
    },
    enabled: query.length >= 2,
  });
}

