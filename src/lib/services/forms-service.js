import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './user-service';



export const validateForm2Data = (formData) => {
  const errors = [];
  
  // Student info validation
  if (!formData.student_name?.trim()) errors.push('Student name is required');
  if (!formData.student_number?.trim()) errors.push('Student number is required');
  if (!formData.student_email?.trim()) errors.push('Student email is required');
  if (!formData.student_contact?.trim()) errors.push('Student contact is required');
  if (!formData.parent_guardian_name?.trim()) errors.push('Guardian name is required');
  if (!formData.parent_guardian_contact?.trim()) errors.push('Guardian contact is required');
  if (!formData.parent_guardian_email?.trim()) errors.push('Guardian email is required');

  // HTE recommendation validation
  if (!formData.company_name?.trim()) errors.push('Company name is required');
  if (!formData.company_address?.trim()) errors.push('Company address is required');
  if (!formData.company_contact_number?.trim()) errors.push('Company contact number is required');
  if (!formData.company_email?.trim()) errors.push('Company email is required');
  if (!formData.representative_name?.trim()) errors.push('Representative name is required');
  if (!formData.representative_title?.trim()) errors.push('Representative title is required');
  if (!formData.representative_designation?.trim()) errors.push('Representative designation is required');

  // HTE moa validation
  if (!formData.main_signatory_name?.trim()) errors.push('Main signatory name is required');
  if (!formData.main_signatory_title?.trim()) errors.push('Main signatory title is required');
  if (!formData.main_signatory_designation?.trim()) errors.push('Main signatory designation is required');
  // if (!formData.first_witness_name?.trim()) errors.push('First witness name is required');
  // if (!formData.first_witness_title?.trim()) errors.push('First witness title is required');
  // if (!formData.first_witness_designation?.trim()) errors.push('First witness designation is required');
  // if (!formData.second_witness_name?.trim()) errors.push('Second witness name is required');
  // if (!formData.second_witness_title?.trim()) errors.push('Second witness title is required');
  // if (!formData.second_witness_designation?.trim()) errors.push('Second witness designation is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.student_email && !emailRegex.test(formData.student_email)) {
    errors.push('Invalid student email format');
  }
  if (formData.guardian_email && !emailRegex.test(formData.guardian_email)) {
    errors.push('Invalid guardian email format');
  }
  if (formData.company_email && !emailRegex.test(formData.company_email)) {
    errors.push('Invalid company email format');
  }

  return errors;
};

export async function submitForm2(formData) {
  const supabase = await createClient();

  //Get current user
  const { user, error: userError } = await getCurrentUser();
  if (userError || !user) {
    return { success: false, error: userError || { message: 'User not authenticated' } };
  }

  // Validate input data
  const validationErrors = validateForm2Data(formData);
  if (validationErrors.length > 0) {
    return { success: false, error: { message: validationErrors.join(', ') } };
  }

  try {
    const { data, error } = await supabase.rpc('submit_form2_application', {
      p_student_id: user.user_id,
      p_form_data: formData
    });

    if (error) throw error;

    return {
      success: true,
      data,
      message: 'Form submitted successfully'
    };
  } catch (error) {
    console.error('Form submission error', error);
    return {
      success: false,
      error: { message: error.message || 'Failed to submit form'}
    };
  }
}


export async function getCurrentUserForm2Submission() {
  const supabase = await createClient();

  // Get current user
  const { user, error: userError } = await getCurrentUser();
  if (userError || !user) {
    return { data: null, error: userError || { message: 'User not authenticated' } };
  }

  try {
    const { data, error } = await supabase
      .from('student_form2_submissions')
      .select(`
        submission_id,
        submission_status,
        submitted_at,
        updated_at,
        student_training_info (*),
        hte_recommendation_info (*),
        hte_moa_info (*)
      `)
      .eq('student_id', user.user_id)
      .single();

    if (error) {
      // If no record found, return null data instead of error
      if (error.code === 'PGRST116') {
        return { data: null, error: null, hasSubmission: false };
      }
      throw error;
    }

    return { 
      data, 
      error: null, 
      hasSubmission: true 
    };
  } catch (error) {
    
    console.error('Error fetching user form submission:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to fetch form submission' },
      hasSubmission: false 
    };
  }
  
}



