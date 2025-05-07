import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "./api";
import { toast } from "react-hot-toast";

function useCreateTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
      organizationId,
    }: {
      name: string;
      description: string;
      organizationId: string;
    }) => createTeam(name, description, organizationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['organization', variables.organizationId] });
      toast.success("Team created successfully");
    },
    onError: () => {
      toast.error("Failed to create team");
    },
  });
}

export default useCreateTeamMutation;
