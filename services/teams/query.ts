import { useQuery } from '@tanstack/react-query';
import { getTeamById, getTeams } from './api';

export const useGetTeams = (organizationId: string) => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(organizationId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

export const useGetTeamById = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById(teamId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};