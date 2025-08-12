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