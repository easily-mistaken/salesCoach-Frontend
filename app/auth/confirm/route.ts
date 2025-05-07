import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to /dashboard
      const { data: session } = await supabase.auth.getUser();
      const userId = session?.user?.id;
      if (!userId) {
        redirect("/error");
      }
      const { error: verifyError, data: verifyData } = await supabase
        .from("User")
        .update({
          isEmailVerified: true,
        })
        .eq("id", userId);
      console.log(verifyError, verifyData);
      redirect("/dashboard");
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
