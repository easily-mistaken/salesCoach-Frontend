"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPassword = async ({ password }: { password: string }) => {
  const validation = resetPasswordSchema.safeParse({ password });

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message || "Invalid password format",
    };
  }

  try {
    const supabase = await createClient();

    // This relies on the auth flow - when a user clicks the reset password link
    // Supabase creates a temporary session that's valid only for password reset
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password reset error:", error);
      if (error.message.includes("session")) {
        return {
          error: true,
          message:
            "Your password reset link has expired. Please request a new one.",
        };
      }
      return {
        error: true,
        message: error.message || "Failed to reset password",
      };
    }

    return {
      success: true,
      message: "Password has been successfully reset",
    };
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return {
      error: true,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
