import { useQuery } from "@tanstack/react-query";
import { getInviteDetails } from "./api";

export function useGetInviteDetailsQuery(inviteId: string) {
  return useQuery({
    queryKey: ["inviteDetails", inviteId],
    queryFn: () => getInviteDetails(inviteId),
    enabled: !!inviteId, // Only run the query if inviteId is provided
  });
}
