'use server'

import { createClient } from '@/lib/supabase/server';

export async function getWorkTaskCategories() {
  const supabase = await createClient();

  const { data: work_tasks, error } = await supabase
    .from('work_task_categories')
    .select(`
      category_id,
      category_name,
      description
    `)
    .eq('is_active', true)
    .order('category_name');
    
  if (error) {
    console.error('Error fetching work task categories:', error);
    return { work_tasks: null, error: error.message };
  }

  return { work_tasks, error: null };
}