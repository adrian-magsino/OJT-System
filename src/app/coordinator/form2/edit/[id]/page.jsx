import { getForm2SubmissionByIdAction } from '@/lib/actions/form-actions';
import EditForm2ClientComponent from './EditForm2ClientComponent';

export default async function EditForm2Page({ params }) {
  const { id } = await params; // id is now the submission_id
  
  try {
    // Fetch the form submission by submission_id
    const result = await getForm2SubmissionByIdAction(id);
    
    if (result.error) {
      return (
        <EditForm2ClientComponent 
          initialFormData={null}
          submissionId={id}
          error={result.error.message || 'Failed to load form submission'}
          hasSubmission={false}
        />
      );
    }

    if (!result.hasSubmission || !result.data) {
      return (
        <EditForm2ClientComponent 
          initialFormData={null}
          submissionId={id}
          error="Form submission not found"
          hasSubmission={false}
        />
      );
    }
    
    return (
      <EditForm2ClientComponent 
        initialFormData={result.data}
        submissionId={id}
        error={null}
        hasSubmission={true}
      />
    );
  } catch (error) {
    return (
      <EditForm2ClientComponent 
        initialFormData={null}
        submissionId={id}
        error={error.message || 'An unexpected error occurred'}
        hasSubmission={false}
      />
    );
  }
}