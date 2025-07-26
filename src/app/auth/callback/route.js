import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student";

  const supabase = await createClient();

  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // User is already logged in, redirect to dashboard
    redirect(next);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect to student dashboard after successful login
      redirect(next);
    } else {
      // Check if error is due to code already being used
      if (error.message.includes('code') || error.message.includes('expired') || error.message.includes('invalid')) {
        // Code already used or expired, check if user is now authenticated
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          redirect(next);
        }
      }
      
      // Redirect to error page with error message
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // If no code, redirect to error page
  redirect(`/auth/error?error=${encodeURIComponent("No authorization code provided")}`);
}