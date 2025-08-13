'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createHTEWithWorkTasksAction } from '@/lib/actions/hte-actions';


const BasicInfoForm = ({ formData, handleInputChange }) => (
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
);

const LinksManager = ({ links, handleLinkChange, addLinkField, removeLinkField }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Website/Links
    </label>
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="url"
            value={link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., https://www.techcorp.com"
          />
          <button
            type="button"
            onClick={() => removeLinkField(index)}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            title="Remove link"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addLinkField}
        className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm"
      >
        + Add Link
      </button>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      Add website URLs, social media links, or other relevant links
    </p>
  </div>
);

const WorkTasksSelector = ({ workTaskCategories = [], selectedWorkTasks, handleWorkTaskToggle }) => (
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
);

const ErrorDisplay = ({ error }) => (
  error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
  )
);


export default function CreateHTEClientComponent({ workTaskCategories, error: serverError }) {
  const [formData, setFormData] = useState({
    name: '',
    nature_of_work: '',
    location: '',
    contact_number: '',
    email: '',
    links: [''], // Initialize with one empty link
    description: ''
  });

  const [selectedWorkTasks, setSelectedWorkTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(serverError);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLinkChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? value : link)
    }));
  };

  const addLinkField = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeLinkField = (index) => {
    // Prevent removing the last field if it's the only one
    if (formData.links.length === 1) {
      setFormData(prev => ({
        ...prev,
        links: ['']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    }
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
    
    // Validate links array - only check non-empty links
    const nonEmptyLinks = formData.links.filter(link => link.trim());
    const invalidLinks = nonEmptyLinks.filter(link => !link.startsWith('http'));
    if (invalidLinks.length > 0) {
      errors.push('All website URLs should start with http:// or https://');
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
      // Filter out empty links before submitting
      const processedFormData = {
        ...formData,
        links: formData.links.filter(link => link.trim())
      };

      const result = await createHTEWithWorkTasksAction(processedFormData, selectedWorkTasks);
      
      // Check if the action returned an error
      if (!result.success || result.error) {
        const errorMessage = result.error?.message || 'Failed to create HTE';
        setError(errorMessage);
        console.error('Error creating HTE:', result.error);
        return;
      }

      // Success! Redirect to HTE list
      router.push('/coordinator/hte');
      
    } catch (error) {
      console.error('Unexpected error creating HTE:', error);
      setError(`Failed to create HTE: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/coordinator/hte');
  };

  const handleBack = () => {
    router.push('/coordinator/hte');
  };

  // Handle server errors or missing data
  if (error && workTaskCategories.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New HTE</h1>
        <p className="text-gray-600">Add a new Host Training Establishment to the system</p>
      </div>

      <ErrorDisplay error={error}/>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <BasicInfoForm formData={formData} handleInputChange={handleInputChange} />

        {/*Links Section */}
        <LinksManager
          links={formData.links}
          handleLinkChange={handleLinkChange}
          addLinkField={addLinkField}
          removeLinkField={removeLinkField}
        />

        {/* Work Tasks Section */}
        <WorkTasksSelector
          workTaskCategories={workTaskCategories}
          selectedWorkTasks={selectedWorkTasks}
          handleWorkTaskToggle={handleWorkTaskToggle}
        />

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
            {loading ? 'Creating HTE...' : 'Create HTE'}
          </button>
        </div>
      </form>
    </div>
  );
}