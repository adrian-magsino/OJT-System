'use client'

import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'

export default function GoogleAuthButton() {
  const handleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Login error:', error.message)
      alert('Login failed')
    }
  }

  return (
    <div className="bg-green-600 p-5">
      <h2 className="text-center text-2xl font-bold tracking-tight text-white">
        Sign in using your CvSU Email
      </h2>

      <button
        type="button"
        onClick={handleLogin}
        className="mt-10 flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Image alt="Google" src="/icons/google_icon.svg" width={30} height={30} />
        <span className="text-center text-xl mx-10 text-gray-900">Sign in</span>
      </button>
    </div>
  )
}
