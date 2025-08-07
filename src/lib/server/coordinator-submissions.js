import { createClient } from '@/lib/supabase/server'

export async function fetchSubmissionById(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('get_form2_submission_by_id', {
      p_submission_id: id,
    })
    .single() // because the stored procedure returns exactly one row

  if (error) throw new Error(error.message)
  return data
}
