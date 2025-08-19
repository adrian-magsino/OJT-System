import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const supabase = await createClient();

  // Handle OAuth errors from provider (Google, etc.)
  if (error) {
    console.error('OAuth Provider Error:', {
      error,
      error_description: errorDescription,
      searchParams: Object.fromEntries(searchParams.entries())
    });
    
    // Redirect to auth error page with more specific error info
    const errorMessage = errorDescription || error;
    redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
  }

  // If no code and no error, check for existing session
  if (!code) {
    console.log('No authorization code provided, checking existing session...');
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser) {
      console.log('User already authenticated:', currentUser.id);
      
      // Add delay for database sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', currentUser.id)
          .limit(1);
        
        if (!userError && userData && userData.length > 0) {
          const userRole = userData[0].role;
          console.log('User role found:', userRole);
          
          if (next) {
            redirect(next);
          }
          
          if (['admin', 'ojt_coordinator'].includes(userRole)) {
            redirect('/coordinator');
          } else if (userRole === 'student') {
            redirect('/student');
          }
        } else {
          console.log('No user data found, treating as new user');
          redirect('/student/profile?message=account_setup');
        }
      } catch (dbError) {
        // Only log actual database errors, not redirect errors
        if (!dbError.message?.includes('NEXT_REDIRECT')) {
          console.error('Database error when checking user:', dbError);
        }
        redirect('/student/profile?message=account_setup');
      }
      
      // Fallback
      redirect('/student');
    }
    
    // No user session and no code - redirect to home
    console.log('No code and no session, redirecting to home');
    redirect('/');
  }

  // Handle authorization code exchange
  try {
    console.log('Exchanging authorization code for session...');
    
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      
      // Handle specific exchange errors
      if (exchangeError.message?.includes('expired') || 
          exchangeError.message?.includes('invalid') ||
          exchangeError.message?.includes('already')) {
        
        // Check if user might already be authenticated despite the error
        const { data: { user: fallbackUser } } = await supabase.auth.getUser();
        
        if (fallbackUser) {
          console.log('User authenticated despite exchange error:', fallbackUser.id);
          
          // Add longer delay for new users
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('user_id', fallbackUser.id)
              .limit(1);
            
            if (!userError && userData && userData.length > 0) {
              const userRole = userData[0].role;
              
              if (next) {
                redirect(next);
              }
              
              if (['admin', 'ojt_coordinator'].includes(userRole)) {
                redirect('/coordinator');
              } else if (userRole === 'student') {
                redirect('/student');
              }
            }
          } catch (dbError) {
            // Only log actual database errors, not redirect errors
            if (!dbError.message?.includes('NEXT_REDIRECT')) {
              console.error('Database error in fallback:', dbError);
            }
          }
          
          // New user fallback
          redirect('/student/profile?message=account_setup');
        }
      }
      
      // For other exchange errors, redirect to error page
      const errorMessage = exchangeError.message || 'Authentication failed';
      redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
    }

    // Successful code exchange
    const user = sessionData?.user;
    
    if (!user) {
      console.error('No user data after successful code exchange');
      redirect(`/auth/error?error=${encodeURIComponent('No user data received')}`);
    }

    console.log('Code exchange successful for user:', user.id);

    // Handle next parameter first
    if (next) {
      console.log('Redirecting to next URL:', next);
      redirect(next);
    }

    // Add delay for database triggers to complete for new users
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get user role and redirect accordingly - Remove try-catch to let redirects work
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .limit(1);
    
    if (!userError && userData && userData.length > 0) {
      const userRole = userData[0].role;
      console.log('User role determined:', userRole);
      
      if (['admin', 'ojt_coordinator'].includes(userRole)) {
        redirect('/coordinator');
      } else if (userRole === 'student') {
        redirect('/student');
      }
    } else {
      console.log('No user role found, treating as new user');
      redirect('/student/profile?message=account_setup');
    }

  } catch (error) {
    // Only log actual errors, not redirect errors
    if (!error.message?.includes('NEXT_REDIRECT')) {
      console.error('Unexpected error in auth callback:', error);
      redirect(`/auth/error?error=${encodeURIComponent('Unexpected authentication error')}`);
    }
    // If it's a redirect error, let it bubble up naturally
    throw error;
  }
}