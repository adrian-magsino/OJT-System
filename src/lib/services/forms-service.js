import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const getForm2Submissions = async () => {
  const { data, error } = await supabase
    .from('student_form2_submissions')
    .select(`
      submission_id,
      submission_status,
      submitted_at,
      student_training_info (
        student_name,
        student_email
      ),
      hte_recommendation_info (
        company_name,
        address
      )
    `)
    .order('submitted_at', { ascending: false });

  return { data, error };
};
