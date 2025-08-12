// src/lib/actions/hte-actions.js
'use server';

import { deactivateHTE, getAllHTEs, getHTEs, getHTEById, getRecommendedHTEs } from "@/lib/services/hte-service";
import { 
  getWorkTaskCategoriesService, 
  getHTEWithWorkTasksService, 
  updateHTEWithWorkTasksService 
} from '@/lib/services/hte-service';
import { revalidatePath } from "next/cache";

export async function deactivateHTEAction(hteId) {
  try {
    const result = await deactivateHTE(hteId);

    if (result.success) {
      // Revalidate all HTE-related pages
      revalidatePath('/coordinator/hte');
      revalidatePath('/coordinator/hte/[id]', 'page');
      revalidatePath('/student/hte');
    }

    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: { message: 'Failed to deactivate HTE' }
    };
  }
}

export async function getAllHTEsAction() {
  try {
    const result = await getAllHTEs();
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      htes: null,
      error: { message: 'Failed to fetch HTEs' }
    };
  }
}

export async function getHTEsAction(page = 1, limit = 10, searchQuery = '') {
  try {
    const result = await getHTEs(page, limit, searchQuery);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      htes: null,
      error: { message: 'Failed to fetch HTEs' },
      totalCount: 0
    };
  }
}

export async function getHTEByIdAction(hteId) {
  try {
    const result = await getHTEById(hteId);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      hte: null,
      error: { message: 'Failed to fetch HTE details' }
    };
  }
}

export async function getRecommendedHTEsAction(studentSpecializations, page = 1, limit = 10, searchQuery = '') {
  try {
    const result = await getRecommendedHTEs(studentSpecializations, page, limit, searchQuery);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      htes: null,
      error: { message: 'Failed to fetch recommended HTEs' },
      totalCount: 0
    };
  }
}

export async function getWorkTaskCategoriesAction() {
  try {
    const categories = await getWorkTaskCategoriesService()
    return { categories, error: null }
  } catch (error) {
    return { categories: null, error: { message: error.message } }
  }
}

export async function getHTEWithWorkTasksAction(hteId) {
  try {
    const hteData = await getHTEWithWorkTasksService(hteId)
    return { hteData, error: null }
  } catch (error) {
    return { hteData: null, error: { message: error.message } }
  }
}

export async function updateHTEWithWorkTasksAction(hteId, formData, selectedWorkTasks) {
  try {
    const data = await updateHTEWithWorkTasksService(hteId, formData, selectedWorkTasks)
    return { success: true, data, error: null }
  } catch (error) {
    return { success: false, error: { message: error.message } }
  }
}
