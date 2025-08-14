import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function updateSession(request) {
  console.log('🔥 SUPABASE MIDDLEWARE STARTED for:', request.nextUrl.pathname);
  
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

  console.log('📍 Getting user claims...');
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  console.log('👤 User from claims:', user ? 'EXISTS' : 'NULL');

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

  console.log('🛣️  Route checks:', {
    path: pathname,
    isPublicRoute,
    isAuthRoute,
    isStudentRoute,
    isCoordinatorRoute,
    isRestrictedStudentRoute
  });

  // Allow public routes
  if (isPublicRoute || isAuthRoute) {
    console.log('✅ Allowing public/auth route');
    return supabaseResponse;
  }

  // Check if user is authenticated
  if (!user) {
    console.log('❌ No user found, redirecting to login');
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  console.log('🔐 User authenticated, checking role-based access...');

  // For protected routes, get user role from users table
  if (isStudentRoute || isCoordinatorRoute) {
    console.log("🔍 Fetching user role from database...");
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.sub)
        .single();
      
      console.log('📊 Database query result:', { userData, userError });
      
      if (userError) {
        console.error('💥 Error fetching user role:', userError);
        const url = request.nextUrl.clone();
        url.pathname = "/error";
        return NextResponse.redirect(url);
      }

      const userRole = userData?.role;
      console.log('👥 User role:', userRole, 'for path:', pathname);

      // Check role-based access
      if (isCoordinatorRoute) {
        console.log('🏢 Checking coordinator route access...');
        if (!['admin', 'ojt_coordinator'].includes(userRole)) {
          console.log('🚫 Access denied: Role', userRole, 'cannot access coordinator routes');
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
        console.log('✅ Coordinator access granted');
      }

      if (isStudentRoute) {
        console.log('🎓 Checking student route access...');
        if (!['student', 'admin'].includes(userRole)) {
          console.log('🚫 Access denied: Role', userRole, 'cannot access student routes');
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
        console.log('✅ Student route access granted for role:', userRole);

        // Additional check for restricted student routes (form 2) - only for actual students
        if (isRestrictedStudentRoute && userRole === 'student') {
          console.log('🔒 Checking verification status for restricted route...');
          const { data: profileData, error: profileError } = await supabase
            .from('student_profiles')
            .select('verification_status')
            .eq('student_id', user.sub)
            .single();
          
          console.log('📋 Profile query result:', { profileData, profileError });

          if (profileError) {
            console.error('💥 Error fetching student profile:', profileError);
            const url = request.nextUrl.clone();
            url.pathname = "/student/profile";
            url.searchParams.set('message', 'profile_incomplete');
            return NextResponse.redirect(url);
          }

          const verificationStatus = profileData?.verification_status;
          console.log('🔍 Verification status:', verificationStatus);
          
          if (verificationStatus !== 'approved') {
            console.log('🚫 Access denied: Verification status is', verificationStatus);
            const url = request.nextUrl.clone();
            url.pathname = "/student/verification-required";  // ← Changed this
            url.searchParams.set('status', verificationStatus);
            return NextResponse.redirect(url);
          }
          console.log('✅ Verification check passed');
        }
      }

    } catch (error) {
      console.error('💥 Middleware error:', error);
      const url = request.nextUrl.clone();
      url.pathname = "/error";
      return NextResponse.redirect(url);
    }
  }

  console.log('🎯 Middleware completed successfully');
  return supabaseResponse;
}