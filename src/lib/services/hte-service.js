import { createClient } from "../supabase/server";

export async function getAllHTEs() {
  const supabase = await createClient();
  
  const { data: htes, error } = await supabase
    .from('hte')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description
      `)
      .eq('is_active', true)
      .order('name');
    
  if (error) {
    return { htes: null, error };
  }

  return { htes, error: null};

}


export async function getHTEById(hte_id) {
  const supabase = await createClient();
  
  const { data: hte, error } = await supabase
    .from('hte')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description
      `)
      .eq('hte_id', hte_id)
      .eq('is_active', true)
      .single();
    
  if (error) {
    return { hte: null, error };
  }

  return { hte, error: null};
}