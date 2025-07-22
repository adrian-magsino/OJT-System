'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from '../components/auth/SupabaseProvider'

export default function LogoutButton() {
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
      Logout
    </button>
  )
}
