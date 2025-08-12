import { createClient } from "../supabase/server";
import { getCurrentUser } from "./user-service";

export async function getCurrentStudentProfile() {
  const { user: userData, error: userError } = await getCurrentUser(); //query user data from user-service

  if (userError || !userData) {
    return { student: null, error: userError };
  }

  if (userData.role !== "student" && userData.role !== "admin") {
    return {
      student: null,
      error: { message: "User is not a student" }
    }
  }


  const supabase = await createClient();

  const { data: profileData, error: profileError } = await supabase
    .from("student_profiles")
    .select(`
      student_id,
      student_number,
      program,
      specializations,
      interests,
      verification_status,
      profile_picture_url
    `)
    .eq("student_id", userData.user_id)
    .single()

  if (profileError) {
    return { student: null, error: profileError }
  }

  //combine user data and student profile data
  const student = {
    ...userData,
    ...profileData
  };

  return { student, error: null};
}

export async function updateStudentProfile(updates) {
  const { user: userData, error: userError } = await getCurrentUser();

  if (userError || !userData) {
    return { student: null, error: userError };
  }

  if (userData.role !== "student") {
    return {
      student: null,
      error: { message: "User is not a student" }
    }
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("student_profiles")
    .update(updates)
    .eq("student_id", userData.user_id)

  if (updateError) {
    return {error: updateError};
  }

  return {error: null};
}