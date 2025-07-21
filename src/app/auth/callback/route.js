import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const cookieStore = cookies()
  const requestUrl = new URL(request.url)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => {
          const allCookies = cookieStore.getAll()
          return allCookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: async (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const code = requestUrl.searchParams.get('code')
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin + '/student')
}
