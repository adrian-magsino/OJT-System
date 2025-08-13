// app/(dashboard)/coordinator/form2/view/[id]/page.jsx
import { notFound } from 'next/navigation'
import { getForm2SubmissionByIdAction } from '@/lib/actions/form-actions'
import ViewForm2SubmissionClient from './ViewForm2SubmissionClient'

export default async function ViewForm2Submission({ params }) {
  const { id } = await params

  let result

  try {
    result = await getForm2SubmissionByIdAction(id)
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

  if (result.error) {
    if (result.error.message?.includes('Access denied')) {
      return (
        <div className="flex min-h-[50dvh] flex-col items-center justify-center space-y-3 text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            You do not have access to this page.
          </h2>
        </div>
      )
    }
    console.error('Error fetching submission:', result.error)
    notFound()
  }

  if (!result.hasSubmission || !result.data) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center space-y-3 text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Submission not found or has been deleted.
        </h2>
      </div>
    )
  }

  return <ViewForm2SubmissionClient submission={result.data} />
}