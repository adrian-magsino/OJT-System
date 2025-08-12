// src/app/coordinator/hte/HTEClientComponent.jsx (Client Component)
'use client';

import { useState } from 'react';
import { deactivateHTEAction, getAllHTEsAction } from '@/lib/actions/hte-actions';
import { useRouter } from 'next/navigation';

export default function HTEClientComponent({ initialHTEs, initialError }) {
  const [htes, setHTEs] = useState(initialHTEs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const router = useRouter();

  const fetchHTEs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { htes: data, error: serviceError } = await getAllHTEsAction();
      
      if (serviceError) throw serviceError;
      
      setHTEs(data || []);
    } catch (error) {
      console.error('Error fetching HTEs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (hteId, hteName) => {
    if (!confirm(`Are you sure you want to deactivate "${hteName}"?`)) return;
    
    try {
      setLoading(true);
      
      const result = await deactivateHTEAction(hteId);
      
      if (!result.success) {
        throw new Error(result.error.message);
      }
      
      // Refresh the list
      await fetchHTEs();
      alert(result.message || 'HTE deactivated successfully');
    } catch (error) {
      console.error('Error deactivating HTE:', error);
      alert(`Failed to deactivate HTE: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during refetch
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading HTEs...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={fetchHTEs}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">HTE Management</h1>
        <button 
          onClick={() => router.push('/coordinator/hte/create')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add New HTE
        </button>
      </div>
      
      {htes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No HTEs found</div>
          <p className="text-gray-400 mb-6">Get started by creating your first HTE!</p>
          <button 
            onClick={() => router.push('/coordinator/hte/create')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create First HTE
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nature of Work
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {htes.map(hte => (
                  <tr key={hte.hte_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {/* Display profile picture if available */}
                        {hte.profile_picture && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={hte.profile_picture} 
                              alt={`${hte.name} logo`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {hte.name}
                          </div>
                          {/* Display links array */}
                          {hte.links && hte.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {hte.links.map((link, index) => (
                                <a 
                                  key={index}
                                  href={link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Link {index + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hte.nature_of_work}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hte.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {hte.work_tasks && hte.work_tasks.length > 0 ? (
                          hte.work_tasks.map((task, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {task}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">No tasks assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        {hte.email && (
                          <div className="text-sm text-gray-600">{hte.email}</div>
                        )}
                        {hte.contact_number && (
                          <div className="text-sm text-gray-600">{hte.contact_number}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push(`/coordinator/hte/view/${hte.hte_id}`)}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => router.push(`/coordinator/hte/edit/${hte.hte_id}`)}
                          className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeactivate(hte.hte_id, hte.name)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        Showing {htes.length} active HTE{htes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}