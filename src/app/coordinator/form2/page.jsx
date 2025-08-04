// src/app/coordinator/form2/page.jsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Forms2ClientComponent from './Form2ClientComponent'

export default async function Forms2Page() {
  const supabase = await createClient()
  
  // Get user session on server side
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is coordinator
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!userData || !['admin', 'ojt_coordinator'].includes(userData.role)) {
    redirect('/unauthorized')
  }

  // Fetch initial data on server side (optional, for better performance)
  const { data: initialSubmissions, error: submissionsError } = await supabase
    .rpc('get_form2_submissions_with_details')

  return (
    <div>
      <Forms2ClientComponent 
        initialSubmissions={initialSubmissions || []} 
        user={user}
      />
    </div>
  )
}
