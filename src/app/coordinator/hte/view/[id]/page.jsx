import { getHTEByIdAction } from '@/lib/actions/hte-actions';
import ViewHTEClientComponent from './ViewHTEClientComponent';

export default async function ViewHTEPage({ params }) {
  const { id } = await params;
  
  try {
    // Fetch HTE data on server side
    const { hte, error } = await getHTEByIdAction(id);
    
    if (error) {
      return (
        <ViewHTEClientComponent 
          initialHTE={null} 
          hteId={id}
          error={error.message || 'Failed to fetch HTE details'}
        />
      );
    }

    return (
      <ViewHTEClientComponent 
        initialHTE={hte} 
        hteId={id}
        error={null}
      />
    );
  } catch (error) {
    return (
      <ViewHTEClientComponent 
        initialHTE={null} 
        hteId={id}
        error={error.message || 'An unexpected error occurred'}
      />
    );
  }
}