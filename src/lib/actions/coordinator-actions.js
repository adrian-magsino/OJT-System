'use server'

import { 
  getForm2Submissions, 
  reviewForm2Submission, 
  generateDocument,
  checkIsCoordinator,
  getStudentsByProgram,
  getVerifiedStudents,
  addVerifiedStudent,
  addVerifiedStudentsBulk,
  removeVerifiedStudent
} from '@/lib/services/coordinator-service'
import { revalidatePath } from 'next/cache'

export async function getStudentsByProgramAction(program) {
  try {
    const result = await getStudentsByProgram(program)
    
    if (!result.success) {
      return { success: false, error: result.error?.message || 'Failed to fetch students' }
    }
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error in getStudentsByProgramAction:', error)
    return { success: false, error: error.message }
  }
}

export async function checkCoordinatorStatusAction() {
  try {
    const result = await checkIsCoordinator()
    return result
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      isCoordinator: false,
      error: { message: 'Failed to check coordinator status' }
    }
  }
}

export async function fetchSubmissionsAction() {
  try {
    const result = await getForm2Submissions()
    return result
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      data: [],
      error: { message: 'Failed to fetch submissions' }
    }
  }
}

export async function reviewSubmissionAction(submissionId, status) {
  try {
    const result = await reviewForm2Submission(submissionId, status)
    
    if (result.success) {
      revalidatePath('/coordinator/form2')
    }
    
    return result
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: { message: 'Failed to review submission' }
    }
  }
}

export async function generateDocumentAction(submissionId, documentType = 'recommendation_letter') {
  try {
    const result = await generateDocument(submissionId, documentType)
    
    if (!result.success) {
      return { success: false, error: result.error?.message || 'Failed to generate document' }
    }
    
    // Revalidate the correct paths
    revalidatePath('/coordinator/generate-rl')
    revalidatePath('/coordinator/form2')
    
    return { success: true, fileName: result.fileName, message: result.message }
  } catch (error) {
    console.error('Error in generateDocumentAction:', error)
    return { success: false, error: error.message }
  }
}

//FOR STUDENT VERIFICATION
export async function getVerifiedStudentsAction() {
  return await getVerifiedStudents()
}

export async function addVerifiedStudentAction(email, studentNumber, program) {
  const result = await addVerifiedStudent(email, studentNumber, program)
  
  if (result.success) {
    revalidatePath('/coordinator/verification')
  }
  
  return result
}

export async function addVerifiedStudentsBulkAction(studentsData) {
  const result = await addVerifiedStudentsBulk(studentsData)
  
  if (result.success) {
    revalidatePath('/coordinator/verification')
  }
  
  return result
}

export async function removeVerifiedStudentAction(id) {
  const result = await removeVerifiedStudent(id)
  
  if (result.success) {
    revalidatePath('/coordinator/verification')
  }
  
  return result
}