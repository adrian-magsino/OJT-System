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
      verified_by,
      verified_at
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

  if (userData.role !== "student" && userData.role !== "admin") {
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

export async function updateStudentProfileWithVerification(updates) {
  const { user: userData, error: userError } = await getCurrentUser();

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

  // First update the student profile
  const { error: updateError } = await supabase
    .from("student_profiles")
    .update(updates)
    .eq("student_id", userData.user_id)

  if (updateError) {
    return { error: updateError };
  }

  // If program and/or student_number are being updated, trigger verification
  if (updates.program || updates.student_number) {
    // Get current profile data including the updates
    const { data: currentProfile, error: profileError } = await supabase
      .from("student_profiles")
      .select("student_number, program")
      .eq("student_id", userData.user_id)
      .single();

    if (profileError) {
      return { error: profileError };
    }

    // Call verification function
    const { data: verificationResult, error: verificationError } = await supabase
      .rpc('verify_student_account', {
        p_student_id: userData.user_id,
        p_email: userData.email,
        p_student_number: currentProfile.student_number,
        p_program: currentProfile.program
      });

    if (verificationError) {
      console.error('Verification error:', verificationError);
      // Don't return error here as the profile update was successful
      // Just log the verification error
    }

    return { 
      error: null, 
      verificationResult: verificationResult?.[0] || null 
    };
  }

  return { error: null };
}