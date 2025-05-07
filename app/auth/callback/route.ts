import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: session } = await supabase.auth.getUser();

      // Create the user object in the public.User table
      const { data: userData, error: userError } = await supabase
        .from("User")
        .insert([
          {
            id: session.user?.id,
            firstName: session.user?.user_metadata.full_name,
            lastName: null,
            email: session.user?.email,
            isEmailVerified: true,
          },
        ]);

      console.log(
        "after inserting: userData",
        userData,
        "userError",
        userError
      );

      // Simplified redirect logic
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
