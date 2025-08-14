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

  // Define route protection rules
  const publicRoutes = ["/", "/home", "/about"];
  const authRoutes = ["/auth"];
  const studentRoutes = ["/student"];
  const coordinatorRoutes = ["/coordinator"];

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  const isStudentRoute = studentRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  const isCoordinatorRoute = coordinatorRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute || isAuthRoute) {
    return supabaseResponse;
  }

  // Check if user is authenticated
  if (!user) {
    console.log('No user found, redirecting to login');
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // For protected routes, get user role from database
  if (isStudentRoute || isCoordinatorRoute) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.sub)  // user.sub is the user ID in the claims
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        const url = request.nextUrl.clone();
        url.pathname = "/error";
        return NextResponse.redirect(url);
      }

      const userRole = userData?.role;
      console.log('User role:', userRole, 'Requested path:', request.nextUrl.pathname);

      // Check role-based access
      if (isCoordinatorRoute) {
        // Only coordinators and admins can access coordinator routes
        if (!['admin', 'ojt_coordinator'].includes(userRole)) {
          console.log('Access denied: User role', userRole, 'cannot access coordinator routes');
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }

      if (isStudentRoute) {
        // Only students can access student routes (unless they're admin)
        if (!['student', 'admin'].includes(userRole)) {
          console.log('Access denied: User role', userRole, 'cannot access student routes');
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }

    } catch (error) {
      console.error('Middleware error:', error);
      const url = request.nextUrl.clone();
      url.pathname = "/error";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}