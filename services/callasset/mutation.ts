import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAsset, deleteAsset } from "./api";
import { toast } from "react-hot-toast";

function useUploadAsset() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (
        { content, type, organisationId}:
         { 
            content: string;
            type: "FILE" | "TEXT";
            organisationId: string;
         } ) => uploadAsset(content, type, organisationId),
      onError: () => {
        toast.error("Failed to upload asset");
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['assets', variables.organisationId] });
        toast.success("Successfully uploaded asset")
      }
    });
}

function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      { id }:
       {
        id: string 
       } ) => deleteAsset(id),
    onError: () => {
      toast.error("Failed to delete asset");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success("Successfully deleted asset")
    }
  });
}

export { useUploadAsset, useDeleteAsset };