import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import toast from 'react-hot-toast';

export function useSearchOSMRoads(query: string, lat: number, lng: number, radius = 5000) {
  return useQuery({
    queryKey: ['osm-search', query, lat, lng, radius],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/osm/search?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return data;
    },
    enabled: query.length >= 2,
  });
}

export function useOSMWay(osmWayId: string) {
  return useQuery({
    queryKey: ['osm-way', osmWayId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/osm/way/${osmWayId}`);
      return data;
    },
    enabled: !!osmWayId,
  });
}

export function useRoadByOSMId(osmWayId: string) {
  return useQuery({
    queryKey: ['road-by-osm', osmWayId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/osm/${osmWayId}`);
      return data;
    },
    enabled: !!osmWayId,
    retry: false,
  });
}

