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

export async function updateProfilePicture(pfpData) {
  const { user: userData, error: userError } = await getCurrentUser();

  if (userError || !userData) {
    throw new Error('User not authenticated');
  }

  if (userData.role !== "student" && userData.role !== "admin") {
    throw new Error('User is not a student');
  }

  const supabase = await createClient();

  try {
    // If pfpData is null, remove the profile picture
    if (!pfpData) {
      const { error } = await updateStudentProfile({
        profile_picture_url: null
      });

      if (error) {
        throw new Error('Failed to remove profile picture');
      }

      revalidatePath('/student/profile');
      return { success: true };
    }

    const file = pfpData.get('profilePicture');
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-${userData.user_id}-${Date.now()}.${fileExtension}`;
    const filePath = `profile-pictures/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('student-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Failed to upload file: ' + uploadError.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('student-files')
      .getPublicUrl(filePath);

    // Update student profile with new picture URL
    const { error: updateError } = await updateStudentProfile({
      profile_picture_url: publicUrl
    });

    if (updateError) {
      // If profile update fails, clean up uploaded file
      await supabase.storage
        .from('student-files')
        .remove([filePath]);
      
      throw new Error('Failed to update profile');
    }

    revalidatePath('/student/profile');
    return { success: true, url: publicUrl };

  } catch (error) {
    console.error('Profile picture update error:', error);
    throw new Error(error.message || 'Failed to update profile picture');
  }
}