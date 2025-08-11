'use client';
import { submitform2Action, updateform2Action, getFormSubmissionAction } from '@/lib/actions/form-actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Transformation function - moved to separate function for better organization
const transformSubmissionData = (submissionData) => {
  const fieldMappings = {
    // Student Training Information
    student_training_info: [
      'student_name',
      'student_number', 
      'student_email',
      'student_contact_number',
      'parent_guardian_name',
      'parent_guardian_contact_number',
      'parent_guardian_email'
    ],
    // HTE Recommendation Information
    hte_recommendation_info: [
      'company_name',
      'company_address',
      'company_contact_number',
      'company_email',
      'representative_name',
      'representative_title',
      'representative_designation'
    ],
    // HTE MOA Information
    hte_moa_info: [
      'main_signatory_name',
      'main_signatory_title',
      'main_signatory_designation',
      'first_witness_name',
      'first_witness_title',
      'first_witness_designation',
      'second_witness_name',
      'second_witness_title',
      'second_witness_designation'
    ]
  };

  const formData = {};
  
  Object.entries(fieldMappings).forEach(([tableKey, fields]) => {
    const tableData = submissionData[tableKey];
    fields.forEach(field => {
      formData[field] = tableData?.[field] || '';
    });
  });

  return formData;
};

export default function EditForm2() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [originalData, setOriginalData] = useState(null)

  const titleOptions = ['Mr.', 'Ms.', 'Dr.', 'Engr.', 'Arch.', 'Hon.'];


  const emptyFormData = {
    // Student Training Information
    student_name: '',
    student_number: '',
    student_email: '',
    student_contact_number: '',
    parent_guardian_name: '',
    parent_guardian_contact_number: '',
    parent_guardian_email: '',
    
    // HTE/IP Information for Recommendation Letter
    company_name: '',
    company_address: '',
    company_contact_number: '',
    company_email: '',
    representative_name: '',
    representative_title: '',
    representative_designation: '',
    
    // HTE/IP Information for Memorandum of Agreement
    main_signatory_name: '',
    main_signatory_title: '',
    main_signatory_designation: '',
    first_witness_name: '',
    first_witness_title: '',
    first_witness_designation: '',
    second_witness_name: '',
    second_witness_title: '',
    second_witness_designation: ''
  };

  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setIsLoading(true);
      const result = await getFormSubmissionAction();
      
      if (result.error) {
        console.error('Error loading form data:', result.error);
        // If there's an error but no existing data, allow new submission
        setHasExistingSubmission(false);
        setFormData(emptyFormData);
      } else if (result.hasSubmission && result.data) {

        const transformedData = transformSubmissionData(result.data)
        //If there is an existing submission
        setHasExistingSubmission(true);
        setFormData(transformedData);
        setOriginalData(transformedData);
        setSubmissionStatus(result.submission_status);
      } else {
        // No existing submission, allow new submission
        setHasExistingSubmission(false);
        setFormData(emptyFormData);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      setHasExistingSubmission(false);
      setFormData(emptyFormData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    //To prevent double submission 
    if (isSubmitting) return;


    setIsSubmitting(true);
    console.log('Form Data:', formData);
    try {
      let result;
      if (hasExistingSubmission) {
        result = await updateform2Action(formData);
      } else {
        result = await submitform2Action(formData);
      }

      if (result.success) {
        const action = hasExistingSubmission ? 'updated' : 'submitted';
        alert(`Form ${action} successfully!`);
        router.push('/student/forms');
      } else {
        alert(`Error: ${result.error.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasExistingSubmission && originalData) {
      // Reset to original data
      setFormData(originalData);
    } else {
      //Reset to empty data
      setFormData(emptyFormData);
    }
    router.push('/student/forms')
  }

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className="flex justify-center items-center h-64">
          <div className='text-lg'>Loading form data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {hasExistingSubmission ? 'Edit Student Information Sheet' : 'Student Information Sheet'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Training Information */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Student Training Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Number *
              </label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Address *
              </label>
              <input
                type="email"
                name="student_email"
                value={formData.student_email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="student_contact_number"
                value={formData.student_contact_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                name="parent_guardian_name"
                value={formData.parent_guardian_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian Contact Number *
              </label>
              <input
                type="tel"
                name="parent_guardian_contact_number"
                value={formData.parent_guardian_contact_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian E-mail Address *
              </label>
              <input
                type="email"
                name="parent_guardian_email"
                value={formData.parent_guardian_email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </section>

        {/* HTE/IP Information for Recommendation Letter */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Host Training Establishment / Industry Partner (HTE/IP) - Recommendation Letter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTE / IP / Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="company_contact_number"
                value={formData.company_contact_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="company_address"
                value={formData.company_address}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail Address *
              </label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Name *
              </label>
              <input
                type="text"
                name="representative_name"
                value={formData.representative_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Title *
              </label>
              <select
                name="representative_title"
                value={formData.representative_title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation / Position *
              </label>
              <input
                type="text"
                name="representative_designation"
                value={formData.representative_designation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>
        </section>

        {/* HTE/IP Information for Memorandum of Agreement */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Host Training Establishment / Industry Partner (HTE/IP) - Memorandum of Agreement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Main Signatory *
              </label>
              <input
                type="text"
                name="main_signatory_name"
                value={formData.main_signatory_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Signatory Title *
              </label>
              <select
                name="main_signatory_title"
                value={formData.main_signatory_title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Signatory Position *
              </label>
              <input
                type="text"
                name="main_signatory_designation"
                value={formData.main_signatory_designation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of First Witness
              </label>
              <input
                type="text"
                name="first_witness_name"
                value={formData.first_witness_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Witness Title
              </label>
              <select
                name="first_witness_title"
                value={formData.first_witness_title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Witness Designation / Position
              </label>
              <input
                type="text"
                name="first_witness_designation"
                value={formData.first_witness_designation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Second Witness 
              </label>
              <input
                type="text"
                name="second_witness_name"
                value={formData.second_witness_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Witness Title
              </label>
              <select
                name="second_witness_title"
                value={formData.second_witness_title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Title</option>
                {titleOptions.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Witness Designation / Position
              </label>
              <input
                type="text"
                name="second_witness_designation"
                value={formData.second_witness_designation}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>           
          </div>
        </section>

        {/* Action Buttons */}
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors "
          >
            Cancel
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSubmitting 
              ? (hasExistingSubmission ? 'Updating...' : 'Submitting...') 
              : (hasExistingSubmission ? 'Update Application' : 'Submit Application')
            }
          </button>
        </div>
      </form>
    </div>
  );
}