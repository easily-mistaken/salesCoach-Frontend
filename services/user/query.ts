import { useQuery } from '@tanstack/react-query';
import { getUser, getUserDetail } from './api';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

export const useGetUserDetail = (userId: string, orgId: string) => {
  return useQuery({
    queryKey: ['userDetail', userId, orgId],
    queryFn: () => getUserDetail(userId, orgId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId && !!orgId,
  });
};