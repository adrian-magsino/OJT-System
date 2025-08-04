// src/lib/actions/form2/coordinator-actions.js
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export const fetchSubmissions = async () => {
  const { data, error } = await supabase.rpc('get_form2_submissions_with_details')
  if (error) throw error
  return data
}

export const reviewSubmission = async (submissionId, status) => {
  const { error } = await supabase.rpc('review_form2_submission', {
    p_submission_id: submissionId,
    p_status: status,
  })
  if (error) throw error
}

export const generateDocument = async (submissionId, documentType) => {
  const fileName = `${documentType}_${submissionId}_${Date.now()}.pdf`
  const { error } = await supabase.rpc('mark_document_generated', {
    p_submission_id: submissionId,
    p_document_type: documentType,
    p_file_name: fileName,
  })
  if (error) throw error
}
