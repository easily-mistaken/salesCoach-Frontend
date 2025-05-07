import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAcceptInviteMutation } from "@/services/invite/mutation";
import { useGetInviteDetailsQuery } from "@/services/invite/query";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

/**
 * Custom hook to handle invitation flow
 */
export function useInviteFlow(inviteId: string) {
  const router = useRouter();
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get invite details
  const {
    data: inviteDetails,
    isLoading: isLoadingInvite,
    error: inviteError,
    isError,
  } = useGetInviteDetailsQuery(inviteId);

  // Accept invitation mutation
  const acceptInviteMutation = useAcceptInviteMutation();

  // Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        const { data: userData } = await supabase.auth.getUser();
        setCurrentUser(userData.user);
      }
    };

    checkUserSession();
  }, [supabase]);

  // Auto-accept invitation if user is logged in and has valid invite
  useEffect(() => {
    const acceptInviteIfLoggedIn = async () => {
      if (
        isLoggedIn &&
        currentUser &&
        inviteDetails &&
        !isProcessing &&
        !isError
      ) {
        setIsProcessing(true);
        try {
          await acceptInviteMutation.mutateAsync({ inviteId });
          toast.success(
            `You've been added to ${inviteDetails.organizationName}!`
          );
          router.push("/dashboard");
        } catch (error) {
          console.error("Failed to automatically accept invite:", error);
          setIsProcessing(false);
          toast.error(
            "There was a problem accepting the invitation. Please try again."
          );
        }
      }
    };

    acceptInviteIfLoggedIn();
  }, [
    isLoggedIn,
    currentUser,
    inviteDetails,
    inviteId,
    acceptInviteMutation,
    router,
    isProcessing,
    isError,
  ]);

  // Handle successful login/signup
  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  return {
    inviteDetails,
    isLoggedIn,
    isLoadingInvite,
    inviteError,
    isProcessing,
    currentUser,
    handleAuthSuccess,
    setIsLoggedIn,
    acceptInviteMutation,
  };
}

/**
 * Custom hook to check if an invitation is valid
 */
export function useInviteValidity(inviteId?: string) {
  const { data, isLoading, isError, error } = useGetInviteDetailsQuery(
    inviteId || ""
  );

  const isExpired =
    inviteId &&
    (data?.status === "SUCCESS" ||
      (data?.timestamp &&
        new Date(data.timestamp).setDate(
          new Date(data.timestamp).getDate() + 7
        ) < Date.now()));

  // Skip query logic if no inviteId is provided
  const isValid = !!inviteId && !isError && !isExpired && !!data;

  return {
    isValid,
    isLoading: inviteId ? isLoading : false,
    data: inviteId ? data : null,
    error: inviteId ? error : null,
    isExpired: !!isExpired,
  };
}
