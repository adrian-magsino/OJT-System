'use server'

import { updateStudentProfile } from "@/lib/services/student-service";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/services/user-service";

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
