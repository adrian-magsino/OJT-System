'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateForm2ByIdAction } from '@/lib/actions/form-actions';

export default function EditForm2ClientComponent({ 
  initialFormData, 
  submissionId, 
  error: serverError, 
  hasSubmission 
}) {
  const [formData, setFormData] = useState(() => {
    if (!initialFormData) return {};
    
    // Extract data from the nested structure
    const studentTraining = initialFormData.student_training_info || {};
    const hteRecommendation = initialFormData.hte_recommendation_info || {};
    const hteMoa = initialFormData.hte_moa_info || {};
    
    return {
      // Student Training Info
      student_name: studentTraining.student_name || '',
      student_number: studentTraining.student_number || '',
      student_email: studentTraining.student_email || '',
      student_contact_number: studentTraining.student_contact_number || '',
      parent_guardian_name: studentTraining.parent_guardian_name || '',
      parent_guardian_contact_number: studentTraining.parent_guardian_contact_number || '',
      parent_guardian_email: studentTraining.parent_guardian_email || '',
      
      // HTE Recommendation Info
      company_name: hteRecommendation.company_name || '',
      company_address: hteRecommendation.company_address || '',
      company_contact_number: hteRecommendation.company_contact_number || '',
      company_email: hteRecommendation.company_email || '',
      representative_name: hteRecommendation.representative_name || '',
      representative_title: hteRecommendation.representative_title || '',
      representative_designation: hteRecommendation.representative_designation || '',
      
      // HTE MOA Info
      main_signatory_name: hteMoa.main_signatory_name || '',
      main_signatory_title: hteMoa.main_signatory_title || '',
      main_signatory_designation: hteMoa.main_signatory_designation || '',
      first_witness_name: hteMoa.first_witness_name || '',
      first_witness_title: hteMoa.first_witness_title || '',
      first_witness_designation: hteMoa.first_witness_designation || '',
      second_witness_name: hteMoa.second_witness_name || '',
      second_witness_title: hteMoa.second_witness_title || '',
      second_witness_designation: hteMoa.second_witness_designation || '',
    };
  });

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

  const validateForm = () => {
    const errors = [];
    
    // Student info validation
    if (!formData.student_name?.trim()) errors.push('Student name is required');
    if (!formData.student_number?.trim()) errors.push('Student number is required');
    if (!formData.student_email?.trim()) errors.push('Student email is required');
    if (!formData.student_contact_number?.trim()) errors.push('Student contact is required');
    if (!formData.parent_guardian_name?.trim()) errors.push('Guardian name is required');
    if (!formData.parent_guardian_contact_number?.trim()) errors.push('Guardian contact is required');
    if (!formData.parent_guardian_email?.trim()) errors.push('Guardian email is required');

    // HTE recommendation validation
    if (!formData.company_name?.trim()) errors.push('Company name is required');
    if (!formData.company_address?.trim()) errors.push('Company address is required');
    if (!formData.company_contact_number?.trim()) errors.push('Company contact number is required');
    if (!formData.company_email?.trim()) errors.push('Company email is required');
    if (!formData.representative_name?.trim()) errors.push('Representative name is required');
    if (!formData.representative_title?.trim()) errors.push('Representative title is required');
    if (!formData.representative_designation?.trim()) errors.push('Representative designation is required');

    // HTE moa validation (main signatory only)
    if (!formData.main_signatory_name?.trim()) errors.push('Main signatory name is required');
    if (!formData.main_signatory_title?.trim()) errors.push('Main signatory title is required');
    if (!formData.main_signatory_designation?.trim()) errors.push('Main signatory designation is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.student_email && !emailRegex.test(formData.student_email)) {
      errors.push('Invalid student email format');
    }
    if (formData.parent_guardian_email && !emailRegex.test(formData.parent_guardian_email)) {
      errors.push('Invalid guardian email format');
    }
    if (formData.company_email && !emailRegex.test(formData.company_email)) {
      errors.push('Invalid company email format');
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
      const result = await updateForm2ByIdAction(submissionId, formData);
      
      if (!result.success || result.error) {
        const errorMessage = result.error?.message || 'Failed to update form';
        setError(errorMessage);
        console.error('Error updating form:', result.error);
        return;
      }

      // Success! Redirect back to the form view
      router.push(`/coordinator/form2/view/${submissionId}`);
      
    } catch (error) {
      console.error('Unexpected error updating form:', error);
      setError(`Failed to update form: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/coordinator/form2/view/${submissionId}`);
  };

  const handleBack = () => {
    router.push('/coordinator/form2');
  };

  // Handle server errors or missing data
  if (error && !hasSubmission) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Form Submissions
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
        >
          ← Back to Form Submissions
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Form 2 Submission</h1>
        <p className="text-gray-600">Submission ID: {submissionId}</p>
        {initialFormData && (
          <p className="text-sm text-gray-500">
            Submission Status: <span className="font-medium">{initialFormData.submission_status}</span> | 
            Last Updated: {new Date(initialFormData.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Training Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Training Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                id="student_name"
                name="student_name"
                value={formData.student_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="student_number" className="block text-sm font-medium text-gray-700 mb-2">
                Student Number *
              </label>
              <input
                type="text"
                id="student_number"
                name="student_number"
                value={formData.student_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="student_email" className="block text-sm font-medium text-gray-700 mb-2">
                Student Email *
              </label>
              <input
                type="email"
                id="student_email"
                name="student_email"
                value={formData.student_email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="student_contact_number" className="block text-sm font-medium text-gray-700 mb-2">
                Student Contact Number *
              </label>
              <input
                type="tel"
                id="student_contact_number"
                name="student_contact_number"
                value={formData.student_contact_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="parent_guardian_name" className="block text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                id="parent_guardian_name"
                name="parent_guardian_name"
                value={formData.parent_guardian_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="parent_guardian_contact_number" className="block text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian Contact *
              </label>
              <input
                type="tel"
                id="parent_guardian_contact_number"
                name="parent_guardian_contact_number"
                value={formData.parent_guardian_contact_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="parent_guardian_email" className="block text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian Email *
              </label>
              <input
                type="email"
                id="parent_guardian_email"
                name="parent_guardian_email"
                value={formData.parent_guardian_email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* HTE Recommendation Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">HTE Recommendation Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="company_address" className="block text-sm font-medium text-gray-700 mb-2">
                Company Address *
              </label>
              <input
                type="text"
                id="company_address"
                name="company_address"
                value={formData.company_address || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="company_contact_number" className="block text-sm font-medium text-gray-700 mb-2">
                Company Contact Number *
              </label>
              <input
                type="tel"
                id="company_contact_number"
                name="company_contact_number"
                value={formData.company_contact_number || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="company_email" className="block text-sm font-medium text-gray-700 mb-2">
                Company Email *
              </label>
              <input
                type="email"
                id="company_email"
                name="company_email"
                value={formData.company_email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="representative_name" className="block text-sm font-medium text-gray-700 mb-2">
                Representative Name *
              </label>
              <input
                type="text"
                id="representative_name"
                name="representative_name"
                value={formData.representative_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="representative_title" className="block text-sm font-medium text-gray-700 mb-2">
                Representative Title *
              </label>
              <input
                type="text"
                id="representative_title"
                name="representative_title"
                value={formData.representative_title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="representative_designation" className="block text-sm font-medium text-gray-700 mb-2">
                Representative Designation *
              </label>
              <input
                type="text"
                id="representative_designation"
                name="representative_designation"
                value={formData.representative_designation || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* HTE MOA Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">HTE MOA Information</h2>
          
          {/* Main Signatory */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Main Signatory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="main_signatory_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="main_signatory_name"
                  name="main_signatory_name"
                  value={formData.main_signatory_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="main_signatory_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="main_signatory_title"
                  name="main_signatory_title"
                  value={formData.main_signatory_title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="main_signatory_designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  id="main_signatory_designation"
                  name="main_signatory_designation"
                  value={formData.main_signatory_designation || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* First Witness */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">First Witness</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="first_witness_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="first_witness_name"
                  name="first_witness_name"
                  value={formData.first_witness_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="first_witness_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="first_witness_title"
                  name="first_witness_title"
                  value={formData.first_witness_title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="first_witness_designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  id="first_witness_designation"
                  name="first_witness_designation"
                  value={formData.first_witness_designation || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Second Witness */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Second Witness</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="second_witness_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="second_witness_name"
                  name="second_witness_name"
                  value={formData.second_witness_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="second_witness_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="second_witness_title"
                  name="second_witness_title"
                  value={formData.second_witness_title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="second_witness_designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  id="second_witness_designation"
                  name="second_witness_designation"
                  value={formData.second_witness_designation || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
            {loading ? 'Updating Form...' : 'Update Form'}
          </button>
        </div>
      </form>
    </div>
  );
}