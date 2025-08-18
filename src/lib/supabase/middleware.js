import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Define route protection rules - FIX THE LOGIC
  const pathname = request.nextUrl.pathname;
  
  // Check exact matches first, then specific patterns
  const isPublicRoute = 
    pathname === "/" || 
    pathname.startsWith("/home") || 
    pathname.startsWith("/about") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".well-known");
    
  const isAuthRoute = pathname.startsWith("/auth");
  const isStudentRoute = pathname.startsWith("/student");
  const isCoordinatorRoute = pathname.startsWith("/coordinator");
  const isRestrictedStudentRoute = pathname.startsWith("/student/forms");

  // Allow public routes
  if (isPublicRoute || isAuthRoute) {
    return supabaseResponse;
  }

  // Check if user is authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // For protected routes, get user role from users table
  if (isStudentRoute || isCoordinatorRoute) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.sub)
        .single();
      
      if (userError) {
        const url = request.nextUrl.clone();
        url.pathname = "/error";
        return NextResponse.redirect(url);
      }

      const userRole = userData?.role;

      // Check role-based access
      if (isCoordinatorRoute) {
        if (!['admin', 'ojt_coordinator'].includes(userRole)) {
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }

      if (isStudentRoute) {
        if (!['student', 'admin'].includes(userRole)) {
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }

        // Additional check for restricted student routes (form 2) - only for actual students
        if (isRestrictedStudentRoute && userRole === 'student') {
          const { data: profileData, error: profileError } = await supabase
            .from('student_profiles')
            .select('verification_status')
            .eq('student_id', user.sub)
            .single();
          
          if (profileError) {
            const url = request.nextUrl.clone();
            url.pathname = "/student/profile";
            url.searchParams.set('message', 'profile_incomplete');
            return NextResponse.redirect(url);
          }

          const verificationStatus = profileData?.verification_status;
          
          if (verificationStatus !== 'verified') {
            const url = request.nextUrl.clone();
            url.pathname = "/student/verification-required";  // ← Changed this
            url.searchParams.set('status', verificationStatus);
            return NextResponse.redirect(url);
          }
        }
      }

    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = "/error";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
