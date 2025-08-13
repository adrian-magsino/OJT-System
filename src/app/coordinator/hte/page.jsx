import { getAllHTEsAction } from '@/lib/actions/hte-actions';
import HTEClientComponent from './HTEClientComponent';

export default async function HTEPage() {
  try {
    // Fetch ALL HTEs once on server side
    const result = await getAllHTEsAction();
    
    if (result.error) {
      return (
        <HTEClientComponent 
          initialHTEs={[]}
          error={result.error.message || 'Failed to load HTEs'}
        />
      );
    }
    
    return (
      <HTEClientComponent 
        initialHTEs={result.htes || []}
        error={null}
      />
    );
  } catch (error) {
    return (
      <HTEClientComponent 
        initialHTEs={[]}
        error={error.message || 'An unexpected error occurred'}
      />
    );
  }
}