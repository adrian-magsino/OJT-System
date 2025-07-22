// SupabaseProvider.jsx
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { createContext, useContext, useState } from 'react'

const SupabaseContext = createContext(null)

export function useSupabase() {
  return useContext(SupabaseContext)
}

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  )

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
