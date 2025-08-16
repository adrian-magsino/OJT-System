'use client'

import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function GoogleAuthButton() {
  const handleLogin = async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
        hd: 'cvsu.edu.ph',
        prompt: 'select_account'
      },
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Login error:', error.message)
      alert('Login failed')
    }
  }

  return (
      <button
        type="button"
        onClick={handleLogin}
        className="flex w-full justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:text-white shadow-xl hover:bg-green-400 hover:shadow-green-300 focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-105 transition-transform"
      >
        <Image alt="Google" src="/icons/google_icon.svg" width={30} height={30} />
        <span className="text-center text-xl ml-4">Sign in using CvSU Email</span>
      </button>

  )
}