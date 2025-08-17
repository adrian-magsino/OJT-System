'use server'

import { 
  getForm2Submissions, 
  reviewForm2Submission, 
  generateDocument,
  checkIsCoordinator,
  getStudentsByProgram
} from '@/lib/services/coordinator-service'
import { revalidatePath } from 'next/cache'




export async function getStudentsByProgramAction(program) {
  return await getStudentsByProgram(program)
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

export async function generateDocumentAction(submissionId, documentType) {
  try {
    const result = await generateDocument(submissionId, documentType)
    
    if (result.success) {
      revalidatePath('/coordinator/form2')
    }
    
    return result
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: { message: 'Failed to generate document' }
    }
  }
}