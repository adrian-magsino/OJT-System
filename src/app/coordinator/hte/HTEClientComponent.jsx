'use client';

import { useState } from 'react';
import { deactivateHTEAction, reactivateHTEAction } from '@/lib/actions/hte-actions';
import { useRouter } from 'next/navigation';

export default function HTEClientComponent({ initialHTEs, error: serverError }) {
  const [allHTEs] = useState(initialHTEs || []); // Store all HTEs (never changes)
  const [error, setError] = useState(serverError);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null); // Track which HTE is being acted upon
  const router = useRouter();

  // Client-side filtering - instant and smooth
  const filteredHTEs = allHTEs.filter(hte => {
    if (statusFilter === 'active') return hte.is_active;
    if (statusFilter === 'inactive') return !hte.is_active;
    return true; // 'all'
  });

  // Count for each filter
  const counts = {
    all: allHTEs.length,
    active: allHTEs.filter(h => h.is_active).length,
    inactive: allHTEs.filter(h => !h.is_active).length
  };

  const handleDeactivate = async (hteId, hteName) => {
    if (!confirm(`Are you sure you want to deactivate "${hteName}"?`)) return;
    
    setActionLoading(hteId);
    try {
      const result = await deactivateHTEAction(hteId);
      if (result.success) {
        // Optimistic update - immediately update the UI
        const updatedHTEs = allHTEs.map(hte => 
          hte.hte_id === hteId ? { ...hte, is_active: false } : hte
        );
        // Since allHTEs is from useState with initial value, we need to refresh the page
        // or use a different state management approach
        window.location.reload(); // Simple approach for now
      } else {
        alert(`Failed to deactivate HTE: ${result.error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (hteId, hteName) => {
    if (!confirm(`Are you sure you want to reactivate "${hteName}"?`)) return;
    
    setActionLoading(hteId);
    try {
      const result = await reactivateHTEAction(hteId);
      if (result.success) {
        // Optimistic update
        window.location.reload(); // Simple approach for now
      } else {
        alert(`Failed to reactivate HTE: ${result.error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (hteId) => {
    router.push(`/coordinator/hte/edit/${hteId}`);
  };

  const handleView = (hteId) => {
    router.push(`/coordinator/hte/view/${hteId}`);
  };

  const handleCreate = () => {
    router.push('/coordinator/hte/create');
  };

  if (error && !allHTEs.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Host Training Establishments</h1>
          <p className="text-gray-600 mt-1">Manage and view all HTEs in the system</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New HTE
        </button>
      </div>

      {/* Status Filter - Instant switching */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All HTEs ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'active'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Inactive ({counts.inactive})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong>Warning:</strong> {error}
        </div>
      )}

      {/* HTEs Grid */}
      {filteredHTEs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No {statusFilter === 'all' ? '' : statusFilter} HTEs found
          </div>
          {statusFilter === 'all' && counts.all === 0 && (
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Your First HTE
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHTEs.map((hte) => (
            <div key={hte.hte_id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hte.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hte.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* HTE Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{hte.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{hte.nature_of_work}</p>
                <p className="text-gray-500 text-sm">{hte.location}</p>
                
                {/* Work Tasks */}
                {hte.work_tasks && hte.work_tasks.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {hte.work_tasks.slice(0, 3).map((task, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {task}
                        </span>
                      ))}
                      {hte.work_tasks.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{hte.work_tasks.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(hte.hte_id)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(hte.hte_id)}
                  className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors text-sm"
                >
                  Edit
                </button>
                {hte.is_active ? (
                  <button
                    onClick={() => handleDeactivate(hte.hte_id, hte.name)}
                    disabled={actionLoading === hte.hte_id}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                  >
                    {actionLoading === hte.hte_id ? '...' : 'Deactivate'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(hte.hte_id, hte.name)}
                    disabled={actionLoading === hte.hte_id}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                  >
                    {actionLoading === hte.hte_id ? '...' : 'Activate'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}