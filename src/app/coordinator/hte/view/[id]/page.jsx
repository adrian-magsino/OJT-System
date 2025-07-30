'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';

export default function ViewHTEPage() {
  const [hte, setHTE] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const hteId = params.id;

  useEffect(() => {
    if (hteId) {
      fetchHTE();
    }
  }, [hteId]);

  const fetchHTE = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hte_with_work_tasks')
        .select('*')
        .eq('hte_id', hteId)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('HTE not found');
        return;
      }

      setHTE(data);
    } catch (error) {
      console.error('Error fetching HTE:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/coordinator/hte/edit/${hteId}`);
  };

  const handleDeactivate = async () => {
    if (!confirm(`Are you sure you want to deactivate "${hte.name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('hte')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('hte_id', hteId);
        
      if (error) throw error;
      
      alert('HTE deactivated successfully');
      router.push('/coordinator/hte');
    } catch (error) {
      console.error('Error deactivating HTE:', error);
      alert(`Failed to deactivate HTE: ${error.message}`);
    }
  };

  const handleBack = () => {
    router.push('/coordinator/hte');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading HTE details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to HTE List
        </button>
      </div>
    );
  }

  if (!hte) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">HTE not found</div>
          <button 
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Back to HTE List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button 
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to HTE List
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{hte.name}</h1>
          <p className="text-gray-600 mt-1">{hte.nature_of_work}</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Edit HTE
          </button>
          <button
            onClick={handleDeactivate}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Basic Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
              <p className="text-gray-900">{hte.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nature of Work</label>
              <p className="text-gray-900">{hte.nature_of_work}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
              <p className="text-gray-900">{hte.location}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                hte.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hte.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900">
                {hte.email ? (
                  <a href={`mailto:${hte.email}`} className="text-blue-600 hover:underline">
                    {hte.email}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
              <p className="text-gray-900">
                {hte.contact_number ? (
                  <a href={`tel:${hte.contact_number}`} className="text-blue-600 hover:underline">
                    {hte.contact_number}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
              <p className="text-gray-900">
                {hte.website ? (
                  <a 
                    href={hte.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {hte.website}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Work Tasks */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Work Tasks</h2>
          {hte.work_tasks && hte.work_tasks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {hte.work_tasks.map((task, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {task}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No work tasks assigned</p>
          )}
        </div>

        {/* Description */}
        {hte.description && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
            <div className="text-gray-900 whitespace-pre-wrap">
              {hte.description}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
              <p className="text-gray-700">
                {new Date(hte.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-700">
                {new Date(hte.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}