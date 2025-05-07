import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganisation, inviteToOrganisation } from "./api";
import { toast } from "react-hot-toast";
import { Role } from "@/services/user/api";

function useCreateOrganisationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name }: { name: string }) => createOrganisation(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
      toast.success("Organisation created successfully");
    },
    onError: () => {
      toast.error("Failed to create organisation");
    },
  });
}

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
    }) => inviteToOrganisation(email, role, organizationId, teamIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization', variables.organizationId] });
      toast.success("Invitation sent successfully");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });
}

export default useCreateOrganisationMutation;
