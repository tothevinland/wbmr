import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import {
  RoadsResponse,
  RoadResponse,
  RoadSegmentResponse,
  FeedbackResponse,
  CreateRoadInput,
  UpdateRoadInput,
  FeedbackInput,
  GroupedRoadsResponse,
  RoadSegmentsResponse,
  RoadSearchResponse,
  MainRoadResponse,
  StatusOptionsResponse,
  EditHistoryResponse,
  SegmentEditHistoryResponse,
} from '@/lib/schemas';
import toast from 'react-hot-toast';

export function useRoads(skip = 0, limit = 50) {
  return useQuery<RoadsResponse>({
    queryKey: ['roads', skip, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads?skip=${skip}&limit=${limit}`);
      return data;
    },
  });
}

export function useInfiniteRoads(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['infinite-roads', limit],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const skip = pageParam * limit;
      const { data } = await apiClient.get(`/roads?skip=${skip}&limit=${limit}`);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const currentTotal = allPages.reduce((sum, page) => sum + page.data.roads.length, 0);
      const total = lastPage.data.total;

      if (currentTotal >= total) {
        return undefined;
      }

      return allPages.length;
    },
  });
}

export function useGroupedRoads(skip = 0, limit = 50) {
  return useQuery<GroupedRoadsResponse>({
    queryKey: ['grouped-roads', skip, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads?grouped=true&skip=${skip}&limit=${limit}`);
      return data;
    },
  });
}

export function useInfiniteGroupedRoads(
  limit = 20,
  options?: {
    sortBy?: 'road_name' | 'created_at' | 'status' | 'contractor';
    sortOrder?: 'asc' | 'desc';
    letter?: string;
  }
) {
  const { sortBy = 'created_at', sortOrder = 'desc', letter } = options || {};

  return useInfiniteQuery({
    queryKey: ['infinite-grouped-roads', limit, sortBy, sortOrder, letter],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const skip = pageParam * limit;
      const params = new URLSearchParams({
        grouped: 'true',
        skip: skip.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (letter) {
        params.append('letter', letter);
      }

      const { data } = await apiClient.get(`/roads?${params.toString()}`);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const currentTotal = allPages.reduce((sum, page) => sum + page.data.roads.length, 0);
      const total = lastPage.data.total;

      if (currentTotal >= total) {
        return undefined;
      }

      return allPages.length;
    },
  });
}

export function useMainRoad(roadSlug: string, options?: { enabled?: boolean }) {
  return useQuery<MainRoadResponse>({
    queryKey: ['main-road', roadSlug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/road/${roadSlug}`);
      return data;
    },
    enabled: options?.enabled ?? !!roadSlug,
  });
}

export function useRoadSegments(roadSlug: string, skip = 0, limit = 100, options?: { enabled?: boolean }) {
  return useQuery<RoadSegmentsResponse>({
    queryKey: ['road-segments', roadSlug, skip, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/road/${roadSlug}/segments?skip=${skip}&limit=${limit}`);
      return data;
    },
    enabled: options?.enabled ?? !!roadSlug,
  });
}

export function useInfiniteRoadSegments(roadSlug: string, limit = 30) {
  return useInfiniteQuery({
    queryKey: ['infinite-road-segments', roadSlug, limit],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const skip = pageParam * limit;
      const { data } = await apiClient.get(`/roads/road/${roadSlug}/segments?skip=${skip}&limit=${limit}`);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const currentTotal = allPages.reduce((sum, page) => sum + page.data.geojson.features.length, 0);
      const total = lastPage.data.pagination.total;

      if (currentTotal >= total) {
        return undefined;
      }

      return allPages.length;
    },
    enabled: !!roadSlug,
  });
}

export function useRoadSegment(segmentSlug: string, options?: { enabled?: boolean }) {
  return useQuery<RoadSegmentResponse>({
    queryKey: ['road-segment', segmentSlug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/segment/${segmentSlug}`);
      return data;
    },
    enabled: options?.enabled ?? !!segmentSlug,
  });
}

export function useRoadFeedback(roadSlug: string, skip = 0, limit = 50, options?: { enabled?: boolean }) {
  return useQuery<FeedbackResponse>({
    queryKey: ['feedback', roadSlug, skip, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/road/${roadSlug}/feedback?skip=${skip}&limit=${limit}`);
      return data;
    },
    enabled: options?.enabled ?? !!roadSlug,
  });
}

export function useRoadSearch(query: string, limit = 10) {
  return useQuery<RoadSearchResponse>({
    queryKey: ['road-search', query, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
      });
      const { data } = await apiClient.get(`/search/roads?${params.toString()}`);
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}

export function useCreateRoad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadData: CreateRoadInput) => {
      const { data } = await apiClient.post('/roads', roadData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roads'] });
      toast.success('Road submitted for approval!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create road');
    },
  });
}

export function useUpdateMainRoad(roadSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadData: UpdateRoadInput) => {
      const { data } = await apiClient.put(`/roads/road/${roadSlug}`, roadData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main-road', roadSlug] });
      queryClient.invalidateQueries({ queryKey: ['roads'] });
      toast.success('Road updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update road');
    },
  });
}

export function useUpdateRoad(segmentSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadData: UpdateRoadInput) => {
      const { data } = await apiClient.put(`/roads/segment/${segmentSlug}`, roadData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['road-segment', segmentSlug] });
      queryClient.invalidateQueries({ queryKey: ['roads'] });
      toast.success('Road segment update submitted for approval!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update segment');
    },
  });
}

export function useUploadImage(roadSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post(`/roads/road/${roadSlug}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main-road', roadSlug] });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    },
  });
}

export function useDeleteImage(roadSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const { data } = await apiClient.delete(`/roads/road/${roadSlug}/image`, {
        params: { image_url: imageUrl },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main-road', roadSlug] });
      toast.success('Image deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete image';
      toast.error(message);
    },
  });
}

export function useAddFeedback(roadSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackData: FeedbackInput) => {
      const { data } = await apiClient.post(`/roads/road/${roadSlug}/feedback`, feedbackData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', roadSlug] });
      toast.success('Feedback added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add feedback');
    },
  });
}

export function useDeleteFeedback(roadSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId: string) => {
      const { data } = await apiClient.delete(`/roads/road/${roadSlug}/feedback/${feedbackId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', roadSlug] });
      toast.success('Feedback deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete feedback';
      toast.error(message);
    },
  });
}

export function useStatusOptions() {
  return useQuery<StatusOptionsResponse>({
    queryKey: ['status-options'],
    queryFn: async () => {
      const { data } = await apiClient.get('/roads/status-options');
      return data;
    },
    staleTime: Infinity,
  });
}

export function useRoadHistory(roadSlug: string, options?: { enabled?: boolean }) {
  return useQuery<EditHistoryResponse>({
    queryKey: ['road-history', roadSlug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/road/${roadSlug}/history`);
      return data;
    },
    enabled: options?.enabled ?? !!roadSlug,
  });
}

export function useSegmentHistory(segmentSlug: string, options?: { enabled?: boolean }) {
  return useQuery<SegmentEditHistoryResponse>({
    queryKey: ['segment-history', segmentSlug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/roads/segment/${segmentSlug}/history`);
      return data;
    },
    enabled: options?.enabled ?? !!segmentSlug,
  });
}

export function useUpdateSegment(segmentSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (segmentData: UpdateRoadInput) => {
      const { data } = await apiClient.put(`/roads/segment/${segmentSlug}`, segmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['road-segment', segmentSlug] });
      queryClient.invalidateQueries({ queryKey: ['segment-history', segmentSlug] });
      toast.success('Segment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update segment');
    },
  });
}

