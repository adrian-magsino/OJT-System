'use server'

import { submitForm2, updateForm2, getCurrentUserForm2Submission } from "@/lib/services/forms-service";
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