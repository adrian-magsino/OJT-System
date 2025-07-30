'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  // remember to use LogoutButton instead of LogOutButton
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // Force a refresh to clear any cached data
  }

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
      Logout
    </button>
  )
}