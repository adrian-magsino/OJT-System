'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  )

  return <>{children}</>
}
