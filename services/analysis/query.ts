import { useQuery } from '@tanstack/react-query';
import { getCallAssetWithAnalysis } from './api';

/**
 * Hook to fetch a call asset with its analysis by ID
 * @param id The call asset ID
 * @param enabled Whether the query should automatically run
 */
export const useGetCallAssetWithAnalysis = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['callAsset', id],
    queryFn: () => getCallAssetWithAnalysis(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: !!id && enabled,
  });
};