import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteToOrganisation } from "./api";
import { toast } from "react-hot-toast";
import { Role } from "@/services/user/api";
import { acceptInvite } from "./api";

export function useInviteToOrganisationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      email,
      role,
      organizationId,
      teamIds,
    }: {
      email: string;
      role: Role;
      organizationId: string;
      teamIds: string[];
    }) => inviteToOrganisation({ email, role, organizationId, teamIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization', variables.organizationId] });
      toast.success("Invitation sent successfully");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });
}

export function useAcceptInviteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteId }: { inviteId: string }) => acceptInvite({ inviteId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
      toast.success("Invitation accepted successfully");
    },
    onError: () => {
      toast.error("Failed to accept invitation");
    },
  });
}
