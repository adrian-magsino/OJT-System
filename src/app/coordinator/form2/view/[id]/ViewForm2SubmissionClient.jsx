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
          <h1 className="text-3xl font-bold text-gray-800">{submission.student_name}</h1>
          <p className="text-gray-600 mt-1">{submission.program}</p>
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
              <p className="text-gray-900">{submission.student_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Student Number</label>
              <p className="text-gray-900">{submission.student_number}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{submission.student_email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
              <p className="text-gray-900">{submission.student_contact_number}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Program</label>
              <p className="text-gray-900">{submission.program}</p>
            </div>
          </div>
        </div>

        {/* Organization Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Company / HTE Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
              <p className="text-gray-900">{submission.company_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-900">{submission.company_address}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact</label>
              <p className="text-gray-900">{submission.company_contact}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{submission.company_email}</p>
            </div>
          </div>
        </div>

        {/* Representative */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Representative</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-900">{submission.representative_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
              <p className="text-gray-900">{submission.representative_designation}</p>
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
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {submission.submission_status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed By</label>
              <p className="text-gray-900">{submission.reviewed_by_name || '—'}</p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  )
}
