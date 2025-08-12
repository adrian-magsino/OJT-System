import { createClient } from "../supabase/server";

export async function getAllHTEs() {
  const supabase = await createClient();
  
  const { data: htes, error } = await supabase
    .rpc('get_all_htes');
    
  if (error) {
    return { htes: null, error };
  }
  return { htes, error: null };
}

export async function getHTEs(page = 1, limit = 10, searchQuery = '') {
  const supabase = await createClient();
  
  const { data: results, error } = await supabase
    .rpc('get_htes_paginated', {
      page_num: page,
      page_limit: limit,
      search_query: searchQuery || ''
    });
    
  if (error) {
    return { htes: null, error, totalCount: 0 };
  }
  
  // Extract total count from first row (all rows have the same total_count)
  const totalCount = results && results.length > 0 ? results[0].total_count : 0;
  
  // Remove total_count from each row for cleaner data
  const htes = results?.map(({ total_count, ...hte }) => hte) || [];
  
  return {
    htes,
    error: null,
    totalCount: parseInt(totalCount),
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPreviousPage: page > 1
  };
}

export async function getHTEById(hte_id) {
  const supabase = await createClient();
  
  const { data: results, error } = await supabase
    .rpc('get_hte_by_id', {
      hte_uuid: hte_id
    });
    
  if (error) {
    return { hte: null, error };
  }
  
  // RPC returns an array, but we want single object
  const hte = results && results.length > 0 ? results[0] : null;
  
  if (!hte) {
    return { hte: null, error: { message: 'HTE not found' } };
  }
  
  return { hte, error: null };
}

export async function getRecommendedHTEs(studentSpecializations, page = 1, limit = 10, searchQuery = '') {
  if (!studentSpecializations || studentSpecializations.length === 0) {
    return { 
      htes: [], 
      error: null, 
      totalCount: 0, 
      currentPage: page, 
      totalPages: 0, 
      hasNextPage: false, 
      hasPreviousPage: false 
    };
  }
  
  const supabase = await createClient();
  
  const { data: results, error } = await supabase
    .rpc('get_recommended_htes', {
      student_specializations: studentSpecializations,
      page_num: page,
      page_limit: limit,
      search_query: searchQuery || ''
    });
    
  if (error) {
    console.error('Error fetching recommended HTEs:', error);
    return { htes: null, error, totalCount: 0 };
  }
  
  // Extract total count from first row (all rows have the same total_count)
  const totalCount = results && results.length > 0 ? results[0].total_count : 0;
  
  // Remove total_count from each row for cleaner data
  const htes = results?.map(({ total_count, ...hte }) => hte) || [];
  
  return {
    htes,
    error: null,
    totalCount: parseInt(totalCount),
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPreviousPage: page > 1
  };
}

export async function deactivateHTE(hte_id) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('deactivate_hte', {
      hte_uuid: hte_id
    });
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  // The RPC returns a JSON object with success/error info
  if (data.success) {
    return { 
      success: true, 
      message: data.message,
      data: data.data 
    };
  } else {
    return { 
      success: false, 
      error: data.error.message,
      code: data.error.code 
    };
  }
}

export async function getWorkTaskCategoriesService() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_work_task_categories')
  
  if (error) {
    throw new Error(error.message || 'Failed to fetch work task categories')
  }
  
  return data
}

export async function getHTEWithWorkTasksService(hteId) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_hte_with_work_tasks', {
    hte_uuid: hteId
  })
  
  if (error) {
    throw new Error(error.message || 'Failed to fetch HTE data')
  }
  
  return data
}

export async function updateHTEWithWorkTasksService(hteId, formData, selectedWorkTasks) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('update_hte_with_work_tasks', {
    hte_uuid: hteId,
    hte_name: formData.name,
    hte_nature_of_work: formData.nature_of_work,
    hte_location: formData.location,
    hte_contact_number: formData.contact_number || null,
    hte_email: formData.email || null,
    hte_links: formData.links || null, // Changed from website to links
    hte_description: formData.description || null,
    task_category_ids: selectedWorkTasks
  })
  
  if (error) {
    throw new Error(error.message || 'Failed to update HTE')
  }
  
  return data
}