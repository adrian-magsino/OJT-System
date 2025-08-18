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

//FOR STUDENT VERIFICATION
export async function getVerifiedStudents() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_verified_students')
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Error fetching verified students:', error)
    return {
      success: false,
      data: [],
      error: { message: error.message || 'Failed to fetch verified students' }
    }
  }
}

export async function addVerifiedStudent(email, studentNumber, program) {
  const supabase = await createClient()
  
  try {
    if (!email || !studentNumber || !program) {
      throw new Error('Email, student number, and program are required')
    }

    // Validate program
    if (!['BSCS', 'BSIT'].includes(program)) {
      throw new Error('Invalid program. Must be BSCS or BSIT')
    }

    const { data, error } = await supabase.rpc('add_verified_student', {
      p_email: email.trim(),
      p_student_number: studentNumber.trim(),
      p_program: program.trim()
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data?.[0] || null,
      error: null
    }
  } catch (error) {
    console.error('Error adding verified student:', error)
    return {
      success: false,
      data: null,
      error: { message: error.message || 'Failed to add verified student' }
    }
  }
}

export async function addVerifiedStudentsBulk(studentsData) {
  const supabase = await createClient()
  
  try {
    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      throw new Error('Students data must be a non-empty array')
    }

    // Validate each student's program
    for (const student of studentsData) {
      if (!student.program || !['BSCS', 'BSIT'].includes(student.program)) {
        throw new Error(`Invalid program "${student.program}". Must be BSCS or BSIT`)
      }
    }

    const { data, error } = await supabase.rpc('add_verified_students_bulk', {
      students_data: JSON.stringify(studentsData)
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data?.[0] || { success_count: 0, error_count: 0, errors: [] },
      error: null
    }
  } catch (error) {
    console.error('Error adding verified students in bulk:', error)
    return {
      success: false,
      data: { success_count: 0, error_count: 0, errors: [] },
      error: { message: error.message || 'Failed to add verified students' }
    }
  }
}

export async function removeVerifiedStudent(id) {
  const supabase = await createClient()
  
  try {
    if (!id) {
      throw new Error('Student ID is required')
    }

    const { data, error } = await supabase.rpc('remove_verified_student', {
      p_id: id
    })
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: data,
      error: null
    }
  } catch (error) {
    console.error('Error removing verified student:', error)
    return {
      success: false,
      data: false,
      error: { message: error.message || 'Failed to remove verified student' }
    }
  }
}
