import { createClient } from '@/lib/supabase/server'


export async function getStudentsByProgram(program) {
  const supabase = await createClient()
  
  try {
    // Validate program parameter
    if (!program || !['BSCS', 'BSIT'].includes(program)) {
      throw new Error('Invalid program. Must be BSCS or BSIT')
    }

    const { data, error } = await supabase.rpc('get_students_by_program', {
      program_filter: program
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Error fetching students by program:', error)
    return {
      success: false,
      data: [],
      error: { message: error.message || 'Failed to fetch students' }
    }
  }
}

export async function checkIsCoordinator() {
  const supabase = await createClient()
  
  try {
    
    // First check if we have a user
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase.rpc('is_coordinator')
    
    
    if (error) {
      console.error('RPC error:', error)
      throw error
    }
    
    return {
      success: true,
      isCoordinator: data,
      error: null
    }
  } catch (error) {
    console.error('Error checking coordinator status:', error)
    return {
      success: false,
      isCoordinator: false,
      error: { message: error.message || 'Failed to check coordinator status' }
    }
  }
}

export async function getForm2Submissions() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_form2_submissions_with_details')
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Error fetching form2 submissions:', error)
    return {
      success: false,
      data: [],
      error: { message: error.message || 'Failed to fetch submissions' }
    }
  }
}

export async function reviewForm2Submission(submissionId, status) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.rpc('review_form2_submission', {
      p_submission_id: submissionId,
      p_status: status,
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      message: `Submission ${status} successfully`
    }
  } catch (error) {
    console.error('Error reviewing submission:', error)
    return {
      success: false,
      error: { message: error.message || 'Failed to review submission' }
    }
  }
}

export async function generateDocument(submissionId, documentType) {
  const supabase = await createClient()
  
  try {
    const fileName = `${documentType}_${submissionId}_${Date.now()}.pdf`
    const { error } = await supabase.rpc('mark_document_generated', {
      p_submission_id: submissionId,
      p_document_type: documentType,
      p_file_name: fileName,
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      fileName,
      message: 'Document generated successfully'
    }
  } catch (error) {
    console.error('Error generating document:', error)
    return {
      success: false,
      error: { message: error.message || 'Failed to generate document' }
    }
  }
}

