// app/(dashboard)/coordinator/form2/view/[id]/page.jsx
import { notFound } from 'next/navigation'
import { fetchSubmissionById } from '@/lib/server/coordinator-submissions'
import ViewForm2SubmissionClient from './ViewForm2SubmissionClient'

export default async function ViewForm2Submission({ params }) {
  const { id } = await params

  let submission

  try {
    submission = await fetchSubmissionById(id)
  } catch (error) {
    console.error('Error fetching submission:', error)
    if (error.message?.includes('Access denied')) {
      return (
        <div className="flex min-h-[50dvh] flex-col items-center justify-center space-y-3 text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            You do not have access to this page.
          </h2>
        </div>
      )
    }
    notFound()
  }

  if (!submission) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center space-y-3 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Submission not found or has been deleted.
        </h2>
      </div>
    )
  }

  return <ViewForm2SubmissionClient submission={submission} />
}
