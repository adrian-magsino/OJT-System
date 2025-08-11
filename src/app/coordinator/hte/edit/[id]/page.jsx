'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';

export default function EditHTEPage() {
  const [formData, setFormData] = useState({
    name: '',
    nature_of_work: '',
    location: '',
    contact_number: '',
    email: '',
    website: '',
    description: ''
  });

  const [workTaskCategories, setWorkTaskCategories] = useState([]);
  const [selectedWorkTasks, setSelectedWorkTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const hteId = params.id;

  useEffect(() => {
    if (hteId) {
      Promise.all([
        fetchWorkTaskCategories(),
        fetchHTEData()
      ]).finally(() => {
        setInitialLoading(false);
      });
    }
  }, [hteId]);

  const fetchWorkTaskCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('work_task_categories')
        .select('*')
        .eq('is_active', true)
        .order('category_name');

      if (error) throw error;
      setWorkTaskCategories(data || []);
    } catch (error) {
      console.error('Error fetching work task categories:', error);
      setError('Failed to load work task categories');
    }
  };

  const fetchHTEData = async () => {
    try {
      // Get HTE basic data
      const { data: hteData, error: hteError } = await supabase
        .from('hte')
        .select('*')
        .eq('hte_id', hteId)
        .single();

      if (hteError) throw hteError;
      
      if (!hteData) {
        setError('HTE not found');
        return;
      }

      // Set basic form data
      setFormData({
        name: hteData.name || '',
        nature_of_work: hteData.nature_of_work || '',
        location: hteData.location || '',
        contact_number: hteData.contact_number || '',
        email: hteData.email || '',
        website: hteData.website || '',
        description: hteData.description || ''
      });

      // Get work tasks for this HTE
      const { data: workTasks, error: tasksError } = await supabase
        .from('hte_work_tasks')
        .select('category_id')
        .eq('hte_id', hteId);

      if (tasksError) throw tasksError;

      const selectedTaskIds = workTasks?.map(task => task.category_id) || [];
      setSelectedWorkTasks(selectedTaskIds);

    } catch (error) {
      console.error('Error fetching HTE data:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkTaskToggle = (categoryId) => {
    setSelectedWorkTasks(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Company name is required');
    if (!formData.nature_of_work.trim()) errors.push('Nature of work is required');
    if (!formData.location.trim()) errors.push('Location is required');
    
    if (formData.email && !formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }
    
    if (formData.website && !formData.website.startsWith('http')) {
      errors.push('Website URL should start with http:// or https://');
    }

    if (selectedWorkTasks.length === 0) {
      errors.push('Please select at least one work task category');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Update the HTE record
      const { error: hteError } = await supabase
        .from('hte')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('hte_id', hteId);

      if (hteError) throw hteError;

      // Step 2: Update work tasks using our custom function
      const { error: taskError } = await supabase.rpc('add_hte_work_tasks', {
        hte_uuid: hteId,
        task_category_ids: selectedWorkTasks
      });

      if (taskError) throw taskError;

      // Success! Redirect to HTE view page
      router.push(`/coordinator/hte/view/${hteId}`);
      
    } catch (error) {
      console.error('Error updating HTE:', error);
      setError(`Failed to update HTE: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/coordinator/hte/view/${hteId}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/coordinator/hte');
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading HTE data...</div>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
        >
          ← Back to HTE List
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit HTE</h1>
        <p className="text-gray-600">Update the information for {formData.name}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., TechCorp Solutions Inc."
              required
            />
          </div>

          {/* Nature of Work */}
          <div className="md:col-span-2">
            <label htmlFor="nature_of_work" className="block text-sm font-medium text-gray-700 mb-2">
              Nature of Work *
            </label>
            <input
              type="text"
              id="nature_of_work"
              name="nature_of_work"
              value={formData.nature_of_work}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Software Development, IT Consulting"
              required
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Makati City, Metro Manila"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., +63 912 345 6789"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., hr@techcorp.com"
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., https://www.techcorp.com"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the company, culture, or additional information..."
            />
          </div>
        </div>

        {/* Work Tasks Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Work Tasks *
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select all the types of work tasks that students can perform at this HTE:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workTaskCategories.map(category => (
              <label 
                key={category.category_id}
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedWorkTasks.includes(category.category_id)}
                  onChange={() => handleWorkTaskToggle(category.category_id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {category.category_name}
                  </div>
                  {category.description && (
                    <div className="text-xs text-gray-500">
                      {category.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {selectedWorkTasks.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Selected tasks ({selectedWorkTasks.length}):</strong>
                <div className="mt-1">
                  {workTaskCategories
                    .filter(cat => selectedWorkTasks.includes(cat.category_id))
                    .map(cat => cat.category_name)
                    .join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating HTE...' : 'Update HTE'}
          </button>
        </div>
      </form>
    </div>
  );
}