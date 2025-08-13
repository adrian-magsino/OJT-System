'use client'

import { useRouter } from 'next/navigation'

export default function ViewForm2SubmissionClient({ submission }) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/coordinator/form2');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Submissions
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {submission.student_training_info?.student_name || 'N/A'}
          </h1>
          <p className="text-gray-600 mt-1">
            {submission.student_profiles?.program || 'N/A'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {/* Student Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Student Name</label>
              <p className="text-gray-900">
                {submission.student_training_info?.student_name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Student Number</label>
              <p className="text-gray-900">
                {submission.student_training_info?.student_number || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">
                {submission.student_training_info?.student_email || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
              <p className="text-gray-900">
                {submission.student_training_info?.student_contact_number || 'N/A'}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Program</label>
              <p className="text-gray-900">
                {submission.student_profiles?.program || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Parent/Guardian Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Parent/Guardian Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-900">
                {submission.student_training_info?.parent_guardian_name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
              <p className="text-gray-900">
                {submission.student_training_info?.parent_guardian_contact_number || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">
                {submission.student_training_info?.parent_guardian_email || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Organization Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Company / HTE Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.company_name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.company_address || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.company_contact_number || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.company_email || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Representative */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Representative</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.representative_name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.representative_title || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
              <p className="text-gray-900">
                {submission.hte_recommendation_info?.representative_designation || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* MOA Signatories */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">MOA Signatories</h2>
          
          {/* Main Signatory */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Main Signatory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-gray-900">
                  {submission.hte_moa_info?.main_signatory_name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                <p className="text-gray-900">
                  {submission.hte_moa_info?.main_signatory_title || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                <p className="text-gray-900">
                  {submission.hte_moa_info?.main_signatory_designation || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Witnesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Witness */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">First Witness</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.first_witness_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.first_witness_title || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.first_witness_designation || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Second Witness */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Second Witness</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.second_witness_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.second_witness_title || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                  <p className="text-gray-900">
                    {submission.hte_moa_info?.second_witness_designation || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submission Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                submission.submission_status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : submission.submission_status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {submission.submission_status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed By</label>
              <p className="text-gray-900">{submission.reviewed_by_name || '—'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">MOA Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                submission.moa_is_completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {submission.moa_is_completed ? 'Generated' : 'Not Generated'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">RL Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                submission.rl_is_completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {submission.rl_is_completed ? 'Generated' : 'Not Generated'}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Submitted</label>
              <p className="text-gray-700">
                {submission.submitted_at
                  ? new Date(submission.submitted_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-700">
                {submission.updated_at
                  ? new Date(submission.updated_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed</label>
              <p className="text-gray-700">
                {submission.reviewed_at
                  ? new Date(submission.reviewed_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}