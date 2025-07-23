import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student";

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect to student dashboard after successful login
      redirect(next);
    } else {
      // Redirect to error page with error message
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // If no code, redirect to error page
  redirect(`/auth/error?error=${encodeURIComponent("No authorization code provided")}`);
}