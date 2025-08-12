// src/app/coordinator/hte/page.jsx (Server Component)
import { getAllHTEs } from '@/lib/services/hte-service';
import HTEClientComponent from './HTEClientComponent';

export default async function HTEListPage() {
  // Fetch data on the server
  const { htes, error } = await getAllHTEs();

  // Pass data to client component via props
  return (
    <HTEClientComponent 
      initialHTEs={htes || []} 
      initialError={error} 
    />
  );
}