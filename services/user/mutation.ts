// user-mutations.ts or user-hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, UpdateUserPayload } from './api';
import toast from 'react-hot-toast';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(data),
    onSuccess: () => {
      // Invalidate the user query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success("Update success");
    },
    onError: () => {
        toast.error("Update failed")
    }
  });
};
