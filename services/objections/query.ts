import { useQuery } from '@tanstack/react-query';
import {
  getCategoryCounts,
  getObjections,
  getObjectionById,
  type ObjectionCategory
} from './api';

/**
 * Hook to fetch objection category counts
 */
export const useGetCategoryCounts = (orgId: string) => {
  return useQuery({
    queryKey: ['objectionCategoryCounts', orgId],
    queryFn: () => getCategoryCounts(orgId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

/**
 * Hook to fetch objections with pagination, search and type filtering
 */
export const useGetObjections = (
  orgId: string, 
  page: number = 1, 
  limit: number = 10,
  search: string = '',
  type: 'all' | ObjectionCategory = 'all',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['objections', orgId, page, limit, search, type],
    queryFn: () => getObjections(orgId, page, limit, search, type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled
  });
};

/**
 * Hook to fetch a single objection by ID
 */
export const useGetObjectionById = (orgId: string, id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['objection', orgId, id],
    queryFn: () => getObjectionById(orgId, id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled
  });
};