'use server'

import { updateStudentProfile } from "@/lib/services/student-service";
import { revalidatePath } from "next/cache";

export async function updateSpecializationsAction(specializations) {


  const { error } = await updateStudentProfile({
    specializations: specializations
  });

  if (error) {
    throw new Error(error.message || 'Failed to update specializations');
  }

  // Revalidate the profile page to show updated data
  revalidatePath('/student/profile');
  return { success: true };
}