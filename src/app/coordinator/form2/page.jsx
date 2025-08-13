import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { checkCoordinatorStatusAction, fetchSubmissionsAction } from '@/lib/actions/coordinator-actions'
import Forms2ClientComponent from './Form2ClientComponent'

export default async function Forms2Page() {
  const supabase = await createClient()
  
  // Get user session on server side
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is coordinator using the RPC function
  const coordinatorCheck = await checkCoordinatorStatusAction()
  
  if (!coordinatorCheck.success) {
    redirect('/unauthorized')
  }
  
  if (!coordinatorCheck.isCoordinator) {
    redirect('/unauthorized')
  }

  // Fetch initial data using actions
  const submissionsResult = await fetchSubmissionsAction()

  return (
    <div>
      <Forms2ClientComponent 
        initialSubmissions={submissionsResult.success ? submissionsResult.data : []} 
        user={user}
      />
    </div>
  )
}