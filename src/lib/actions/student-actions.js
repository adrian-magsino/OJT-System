'use server'

import { updateStudentProfile, getCurrentStudentProfile } from "@/lib/services/student-service";
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

export async function updateProgramAndStudentNumber(formData) {
  const program = formData.get('program')?.trim();
  const student_number = formData.get('student_number')?.trim();

  if (!program || !student_number) {
    throw new Error('Program and Student Number are required');
  }

  const { student, error } = await getCurrentStudentProfile();
  if (error || !student) {
    throw new Error(error?.message || 'Unable to load student profile');
  }

  if (student.verification_status?.toLowerCase() === 'verified') {
    throw new Error('Verified students cannot edit program or student number');
  }

  const { error: updateError } = await updateStudentProfile({
    program,
    student_number
  });

  if (updateError) {
    throw new Error(updateError.message || 'Failed to update profile');
  }

  revalidatePath('/student/profile');
  return { success: true };
}
