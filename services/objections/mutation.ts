import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from "@/utils/axios";
import { Objection, ObjectionCategory } from './api';

// Types for mutation requests
interface UpdateObjectionRequest {
  id: string;
  orgId: string;
  text?: string;
  response?: string;
  effectiveness?: number;
  type?: ObjectionCategory;
  success?: boolean;
}

/**
 * Updates an existing objection
 * This is a placeholder - implement the actual API call based on your backend
 */
const updateObjection = async (data: UpdateObjectionRequest): Promise<Objection> => {
  const { id, orgId, ...updateData } = data;
  const response = await api.patch(`/api/objections/${id}`, updateData, {
    params: { orgId }
  });
  return response.data;
};

/**
 * Hook to update an objection
 */
export const useUpdateObjection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateObjection,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['objection', variables.orgId, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['objections', variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ['objectionCategoryCounts', variables.orgId] });
    }
  });
};

// Add more mutation hooks as needed for your objections feature