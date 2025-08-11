import { createClient } from "../supabase/server";

export async function getAllHTEs() {
  const supabase = await createClient();
  
  const { data: htes, error } = await supabase
    .from('hte_with_work_tasks')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description,
      work_tasks
      `)
      .eq('is_active', true)
      .order('name');
    
  if (error) {
    return { htes: null, error };
  }

  return { htes, error: null};

}

//Fetching data with pagination
export async function getHTEs(page = 1, limit= 10) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: htes, error, count } = await supabase
    .from('hte_with_work_tasks')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description,
      work_tasks
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('name')
      .range(from, to);

  if (error) {
    return { htes: null, error, totalCount: 0};
  }

  return {
    htes,
    error: null,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    hasNextPage: page < Math.ceil(count / limit),
    hasPreviousPage: page > 1
  }
}

export async function getHTEById(hte_id) {
  const supabase = await createClient();
  
  const { data: hte, error } = await supabase
    .from('hte_with_work_tasks')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description,
      work_tasks
      `)
      .eq('hte_id', hte_id)
      .eq('is_active', true)
      .single();
    
  if (error) {
    return { hte: null, error };
  }

  return { hte, error: null};
}

export async function getRecommendedHTEs(studentSpecializations, page = 1, limit = 10) {
  if (!studentSpecializations || studentSpecializations.length === 0) {
    return { htes: [], error: null, totalCount: 0, currentPage: page, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  }

  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get HTEs that have work tasks matching student specializations
  const { data: htes, error, count } = await supabase
    .from('hte_with_work_tasks')
    .select(`
      hte_id,
      name,
      nature_of_work,
      location,
      contact_number,
      email,
      website,
      description,
      work_tasks
    `, { count: 'exact' })
    .eq('is_active', true)
    .overlaps('work_tasks', studentSpecializations)
    .order('name')
    .range(from, to);

  if (error) {
    console.error('Error fetching recommended HTEs:', error);
    return { htes: null, error, totalCount: 0 };
  }

  return {
    htes,
    error: null,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    hasNextPage: page < Math.ceil(count / limit),
    hasPreviousPage: page > 1
  };
}