import { fetchSubmissionsAction } from '@/lib/actions/coordinator-actions'
import GenerateRLClientComponent from './GenerateRLClientComponent'

export default async function GenerateRLPage() {
  const submissionsResult = await fetchSubmissionsAction()
  
  const submissions = submissionsResult.success ? submissionsResult.data : []

  return (
    <GenerateRLClientComponent initialSubmissions={submissions} />
  )
}