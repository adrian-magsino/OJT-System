import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './user-service';



export const validateForm2Data = (formData) => {
  const errors = [];
  
  // Student info validation
  if (!formData.student_name?.trim()) errors.push('Student name is required');
  if (!formData.student_number?.trim()) errors.push('Student number is required');
  if (!formData.student_email?.trim()) errors.push('Student email is required');
  if (!formData.student_contact_number?.trim()) errors.push('Student contact is required');
  if (!formData.parent_guardian_name?.trim()) errors.push('Guardian name is required');
  if (!formData.parent_guardian_contact_number?.trim()) errors.push('Guardian contact is required');
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
        reviewed_at,
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



export async function updateForm2(formData) {
  const supabase = await createClient();

  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { success: false, error: userError || { message: 'User not authenticated' } };
  }

  const validationErrors = validateForm2Data(formData);
  if (validationErrors.length > 0) {
    return { success: false, error: { message: validationErrors.join(', ')}};
  }

  try {
    const { data, error } = await supabase.rpc('update_form2_application', {
      p_student_id: user.user_id,
      p_form_data: formData
    });

    if (error) throw error;

    return {
      success: true,
      data,
      message: 'Form updated successfully'
    };
  } catch (error) {
    console.error('Form update error', error);
    return {
      success: false,
      error: { message: error.message || 'Failed to update form'}
    };
  }
}

// Updated to use submission_id instead of student_id
export async function updateForm2ById(submissionId, formData) {
  const supabase = await createClient();

  // Validate input data
  const validationErrors = validateForm2Data(formData);
  if (validationErrors.length > 0) {
    return { success: false, error: { message: validationErrors.join(', ')}};
  }

  try {
    // Call the correct RPC function name
    const { data, error } = await supabase.rpc('update_form2_application_by_submission_id', {
      p_submission_id: submissionId,
      p_form_data: formData
    });

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    return {
      success: true,
      data,
      message: 'Form updated successfully'
    };
  } catch (error) {
    console.error('Form update error:', error);
    return {
      success: false,
      error: { message: error.message || 'Failed to update form'}
    };
  }
}

// New service function using submission_id directly
export async function getForm2SubmissionById(submissionId) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('get_form2_submission_by_id', {
      p_submission_id: submissionId
    });

    if (error) {
      throw error;
    }

    // The RPC returns an array, but we expect a single record
    const formData = data && data.length > 0 ? data[0] : null;

    if (!formData) {
      return { data: null, error: null, hasSubmission: false };
    }

    // Transform the flat RPC response into the nested structure expected by the client
    const transformedData = {
      submission_id: formData.submission_id,
      submission_status: formData.submission_status,
      submitted_at: formData.submitted_at,
      updated_at: formData.updated_at,
      reviewed_at: formData.reviewed_at,
      reviewed_by_name: formData.reviewed_by_name,
      moa_is_completed: formData.moa_is_completed,
      rl_is_completed: formData.rl_is_completed,
      
      // Transform into nested structure for compatibility
      student_training_info: {
        student_name: formData.student_name,
        student_number: formData.student_number,
        student_email: formData.student_email,
        student_contact_number: formData.student_contact_number,
        parent_guardian_name: formData.parent_guardian_name,
        parent_guardian_contact_number: formData.parent_guardian_contact_number,
        parent_guardian_email: formData.parent_guardian_email
      },
      
      student_profiles: {
        program: formData.program
      },
      
      hte_recommendation_info: {
        company_name: formData.company_name,
        company_address: formData.company_address,
        company_contact_number: formData.company_contact_number,
        company_email: formData.company_email,
        representative_name: formData.representative_name,
        representative_title: formData.representative_title,
        representative_designation: formData.representative_designation
      },
      
      hte_moa_info: {
        main_signatory_name: formData.main_signatory_name,
        main_signatory_title: formData.main_signatory_title,
        main_signatory_designation: formData.main_signatory_designation,
        first_witness_name: formData.first_witness_name,
        first_witness_title: formData.first_witness_title,
        first_witness_designation: formData.first_witness_designation,
        second_witness_name: formData.second_witness_name,
        second_witness_title: formData.second_witness_title,
        second_witness_designation: formData.second_witness_designation
      }
    };

    return { 
      data: transformedData, 
      error: null, 
      hasSubmission: true 
    };
  } catch (error) {
    console.error('Error fetching form submission:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to fetch form submission' },
      hasSubmission: false 
    };
  }
}
