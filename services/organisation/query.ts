import { useQuery } from "@tanstack/react-query";
import { getOrgs, getOrgbyId } from "./api";

export const useGetOrgs = () => {
  return useQuery({
    queryKey: ["organisations"],
    queryFn: getOrgs,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const useGetOrgByID = (id: string) => {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => getOrgbyId(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};
