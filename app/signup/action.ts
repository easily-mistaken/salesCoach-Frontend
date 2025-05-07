"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";


export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const newUserSchema = z
    .object({
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      firstName: z.string(),
      lastName: z.string(),
    })

  const newUserValidation = newUserSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "An error occured",
    };
  }

  // supabase authentication from here
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("data", data, "error", error);

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error: true,
      message: "Email already in use",
    };
  }

  if (!data?.user?.id) {
    return {
      error: true,
      message: "Error in creating user",
    };
  }

  console.log("data.user id", data.user?.id);
  // add user to the public.User table with the firstName, lastName and the same id
  const { data: userData, error: userError } = await supabase.from("User").insert([
    {
      id: data.user?.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      isEmailVerified: false,
    },
  ]);

  console.log("after inserting: userData", userData, "userError", userError);

  if (userError) {
    return {
      error: true,
      message: "Auth successful but user creation failed",
    };
  }

  // User successfully created
  return {
    success: true,
    message: "Check your email for the confirmation link",
  };
};
