// src/lib/services/hte-service-client.js
import { createClient } from '@/lib/supabase/client';

export async function fetchActiveHTEs() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hte_with_work_tasks')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deactivateHTE(hteId) {
  const supabase = createClient();

  const { error } = await supabase
    .from('hte')
    .update({
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('hte_id', hteId);

  if (error) throw error;
}
