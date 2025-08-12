'use server'

import { 
  submitForm2, 
  getCurrentUserForm2Submission, 
  updateForm2,
  updateForm2ById,  // Add this import
  getForm2SubmissionById  // Add this import if missing
} from '@/lib/services/forms-service'
import { revalidatePath } from "next/cache";

export async function submitform2Action(formData) {
  try {
    const result = await submitForm2(formData);

    if (result.success) {
      revalidatePath('/student/forms');
      //revalidatePath('/coordinator/form2'); For coordinator side
    }

    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: { message: 'Failed to submit forms'}
    }
  }
}


export async function updateform2Action(formData) {
  try {
    const result = await updateForm2(formData);

    if (result.success) {
      revalidatePath('/student/forms');
      //revalidatePath('/coordinator/form2'); For coordinator side
    }

    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: { message: 'Failed to update forms'}
    }
  }
}

export async function updateForm2ByIdAction(submissionId, formData) {
  try {
    const result = await updateForm2ById(submissionId, formData);

    if (result.success) {
      revalidatePath('/student/forms');
      revalidatePath('/coordinator/form2');
      revalidatePath(`/coordinator/form2/edit/${submissionId}`);
    }

    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: { message: 'Failed to update form'}
    }
  }
}

export async function getFormSubmissionAction() {
  try {
    const result = await getCurrentUserForm2Submission();
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      data: null,
      error: { message: 'Failed to fetch form submission'},
      hasSubmission: false
    };
  }
}

// Updated to use submission_id
export async function getForm2SubmissionByIdAction(submissionId) {
  try {
    const result = await getForm2SubmissionById(submissionId);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      data: null,
      error: { message: 'Failed to fetch form submission'},
      hasSubmission: false
    };
  }
}