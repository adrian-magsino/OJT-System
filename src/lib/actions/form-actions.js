'use server'

import { submitForm2 } from "@/lib/services/forms-service";
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