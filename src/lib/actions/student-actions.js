'use server'

import { updateStudentProfile } from "@/lib/services/student-service";
import { revalidatePath } from "next/cache";

export async function updateSpecializationsField(specializations) {

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

export async function updateInterestsField(interests) {
  const { error } = await updateStudentProfile({
    interests: interests
  });

  if (error) {
    throw new Error(error.message || 'Failed to update interests');
  }

 revalidatePath('/student/profile');
 return { success: true };
}