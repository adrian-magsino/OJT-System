import { getWorkTaskCategoriesAction, getHTEWithWorkTasksAction } from '@/lib/actions/hte-actions'
import EditHTEClientComponent from './EditHTEClientComponent'

export default async function EditHTEPage({ params }) {
  const { id } = await params
  
  try {
    // Fetch both work task categories and HTE data in parallel
    const [categoriesResult, hteResult] = await Promise.all([
      getWorkTaskCategoriesAction(),
      getHTEWithWorkTasksAction(id)
    ])
    
    if (categoriesResult.error) {
      return (
        <EditHTEClientComponent 
          initialFormData={null}
          initialWorkTasks={[]}
          workTaskCategories={[]}
          hteId={id}
          error={categoriesResult.error.message || 'Failed to fetch work task categories'}
        />
      )
    }
    
    if (hteResult.error) {
      return (
        <EditHTEClientComponent 
          initialFormData={null}
          initialWorkTasks={[]}
          workTaskCategories={categoriesResult.categories || []}
          hteId={id}
          error={hteResult.error.message || 'Failed to fetch HTE data'}
        />
      )
    }
    
    const hteData = hteResult.hteData.hte
    const workTasks = hteResult.hteData.work_tasks
    
    const formData = {
      name: hteData.name || '',
      nature_of_work: hteData.nature_of_work || '',
      location: hteData.location || '',
      contact_number: hteData.contact_number || '',
      email: hteData.email || '',
      links: hteData.links || [], // Changed from website to links (array)
      description: hteData.description || '',
      person_in_charge: hteData.person_in_charge || '',
      designation: hteData.designation || '',
      work_setup: hteData.work_setup || []
    }
    
    return (
      <EditHTEClientComponent 
        initialFormData={formData}
        initialWorkTasks={workTasks}
        workTaskCategories={categoriesResult.categories || []}
        hteId={id}
        error={null}
      />
    )
  } catch (error) {
    return (
      <EditHTEClientComponent 
        initialFormData={null}
        initialWorkTasks={[]}
        workTaskCategories={[]}
        hteId={id}
        error={error.message || 'An unexpected error occurred'}
      />
    )
  }
}