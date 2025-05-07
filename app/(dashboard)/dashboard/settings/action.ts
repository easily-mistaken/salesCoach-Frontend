"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  // Validate input
  const validation = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Validation failed",
    };
  }

  // Get Supabase client
  const supabase = await createClient();

  // First, get the current user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      error: true,
      message: "You must be logged in to change your password",
    };
  }

  // Update the password using Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      error: true,
      message: error.message || "Failed to update password",
    };
  }

  // Success! Revalidate the settings page to refresh the data
  revalidatePath("/settings");

  return {
    success: true,
    message: "Password successfully updated",
  };
};
