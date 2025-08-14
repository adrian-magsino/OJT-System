'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deactivateHTEAction, reactivateHTEAction } from '@/lib/actions/hte-actions';

const ErrorDisplay = ({ error, onBack }) => (
  <div className="container mx-auto p-6">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong>Error:</strong> {error}
    </div>
    <button 
      onClick={onBack}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      ← Back to HTE List
    </button>
  </div>
);

const NotFoundDisplay = ({ onBack }) => (
  <div className="container mx-auto p-6">
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg mb-4">HTE not found</div>
      <button 
        onClick={onBack}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back to HTE List
      </button>
    </div>
  </div>
);

const HTEHeader = ({ hte, hteId, actionLoading, onBack, onEdit, onDeactivate, onReactivate }) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <button 
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
      >
        ← Back to HTE List
      </button>
      <h1 className="text-3xl font-bold text-gray-800">{hte.name}</h1>
      <p className="text-gray-600 mt-1">{hte.nature_of_work}</p>
    </div>
    
    <div className="flex space-x-3">
      <button
        onClick={onEdit}
        disabled={actionLoading}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
      >
        Edit HTE
      </button>
      
      {hte.is_active ? (
        <button
          onClick={onDeactivate}
          disabled={actionLoading}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Deactivating...' : 'Deactivate'}
        </button>
      ) : (
        <button
          onClick={onReactivate}
          disabled={actionLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Reactivating...' : 'Reactivate'}
        </button>
      )}
    </div>
  </div>
);

const CompanyInformationSection = ({ hte }) => (
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

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Person-in-charge</label>
        <p className="text-gray-900">
          {hte.person_in_charge || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
        <p className="text-gray-900">
          {hte.designation || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-500 mb-1">Work Setup</label>
        <div className="text-gray-900">
          {hte.work_setup && hte.work_setup.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {hte.work_setup.map((setup, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {setup.charAt(0).toUpperCase() + setup.slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 italic">Not specified</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ContactInformationSection = ({ hte }) => (
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
        <label className="block text-sm font-medium text-gray-500 mb-1">Website/Links</label>
        <div className="text-gray-900">
          {hte.links && hte.links.length > 0 ? (
            <div className="space-y-1">
              {hte.links.map((link, index) => (
                <div key={index}>
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const WorkTasksSection = ({ hte }) => (
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
);

const DescriptionSection = ({ hte }) => (
  hte.description && (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
      <div className="text-gray-900 whitespace-pre-wrap">
        {hte.description}
      </div>
    </div>
  )
);

const MetadataSection = ({ hte }) => (
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
);

export default function ViewHTEClientComponent({ initialHTE, hteId, error: serverError }) {
  const [hte] = useState(initialHTE);
  const [error, setError] = useState(serverError);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/coordinator/hte/edit/${hteId}`);
  };

  const handleDeactivate = async () => {
    if (!confirm(`Are you sure you want to deactivate "${hte.name}"?`)) return;
    
    setActionLoading(true);
    try {
      const result = await deactivateHTEAction(hteId);
      
      if (result.success) {
        alert('HTE deactivated successfully');
        router.push('/coordinator/hte');
      } else {
        alert(`Failed to deactivate HTE: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deactivating HTE:', error);
      alert(`Failed to deactivate HTE: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!confirm(`Are you sure you want to reactivate "${hte.name}"?`)) return;
    
    setActionLoading(true);
    try {
      const result = await reactivateHTEAction(hteId);
      
      if (result.success) {
        alert('HTE reactivated successfully');
        router.push('/coordinator/hte');
      } else {
        alert(`Failed to reactivate HTE: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error reactivating HTE:', error);
      alert(`Failed to reactivate HTE: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/coordinator/hte');
    }
  };

  // Handle server errors or missing HTE
  if (error) {
    return <ErrorDisplay error={error} onBack={handleBack} />;
  }

  if (!hte) {
    return <NotFoundDisplay onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <HTEHeader 
        hte={hte}
        hteId={hteId}
        actionLoading={actionLoading}
        onBack={handleBack}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
      />

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <CompanyInformationSection hte={hte} />
        <ContactInformationSection hte={hte} />
        <WorkTasksSection hte={hte} />
        <DescriptionSection hte={hte} />
        <MetadataSection hte={hte} />
      </div>
    </div>
  );
}