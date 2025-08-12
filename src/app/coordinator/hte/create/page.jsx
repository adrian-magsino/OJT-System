import { getWorkTaskCategoriesAction } from '@/lib/actions/hte-actions';
import CreateHTEClientComponent from './CreateHTEClientComponent';

export default async function CreateHTEPage() {
  try {
    // Fetch work task categories on server side
    const categoriesResult = await getWorkTaskCategoriesAction();
    
    if (categoriesResult.error) {
      return (
        <CreateHTEClientComponent 
          workTaskCategories={[]}
          error={categoriesResult.error.message || 'Failed to load work task categories'}
        />
      );
    }
    
    return (
      <CreateHTEClientComponent 
        workTaskCategories={categoriesResult.categories || []}
        error={null}
      />
    );
  } catch (error) {
    return (
      <CreateHTEClientComponent 
        workTaskCategories={[]}
        error={error.message || 'An unexpected error occurred'}
      />
    );
  }
}