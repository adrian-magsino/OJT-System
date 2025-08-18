import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const supabase = await createClient();

  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && next) {
    redirect(next);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
      
      if (authenticatedUser) {
        if (next) {
          redirect(next);
        }
        
        // Get user role and redirect accordingly
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', authenticatedUser.id)
          .single();
        
        if (!userError && userData?.role) {
          const userRole = userData.role;
          
          if (['admin', 'ojt_coordinator'].includes(userRole)) {
            redirect('/coordinator');
          } else if (userRole === 'student') {
            redirect('/student');
          }
        }
        
        // Fallback
        redirect('/student');
      }
    } else {
      // Handle code already used/expired
      if (error.message.includes('code') || error.message.includes('expired') || error.message.includes('invalid')) {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          if (next) {
            redirect(next);
          }
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', newUser.id)
            .single();
          
          if (!userError && userData?.role) {
            const userRole = userData.role;
            
            if (['admin', 'ojt_coordinator'].includes(userRole)) {
              redirect('/coordinator');
            } else if (userRole === 'student') {
              redirect('/student');
            }
          }
          
          redirect('/student');
        }
      }
      
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(`/auth/error?error=${encodeURIComponent("No authorization code provided")}`);
}