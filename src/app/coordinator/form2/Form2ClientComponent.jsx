'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  fetchSubmissionsAction,
  reviewSubmissionAction,
  generateDocumentAction
} from '@/lib/actions/coordinator-actions'

export default function Forms2ClientComponent({ initialSubmissions, user }) {
  const supabase = createClient()
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const result = await fetchSubmissionsAction()
      if (result.success) {
        setSubmissions(result.data)
      } else {
        console.error('Error fetching submissions:', result.error)
        setSubmissions([])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmission = async (submissionId, status) => {
    try {
      const result = await reviewSubmissionAction(submissionId, status)
      if (result.success) {
        await loadSubmissions()
        alert(result.message || `Submission ${status} successfully!`)
      } else {
        alert(result.error?.message || 'Error updating submission status')
      }
    } catch (error) {
      console.error('Error reviewing submission:', error)
      alert('Error updating submission status')
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('form2_submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_form2_submissions' },
        (payload) => {
          loadSubmissions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = filter === 'all' || submission.submission_status === filter
    const matchesSearch =
      submission.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.company_name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Form 2 Submissions</h1>

        <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
          {/* Filter and Search Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search by name, number, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md w-full sm:w-64"
            />
          </div>

          {/* Generate Document Buttons */}
          <div className="flex gap-2">
            
            <button
              onClick={() => router.push('/coordinator/generate-rl')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
            >
              Generate RL
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-lg">Loading submissions...</div>
        </div>
      ) : (
        <>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No submissions found.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.submission_id} className="hover:bg-gray-50">
                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{submission.student_name}</div>
                          <div className="text-sm text-gray-500">{submission.student_number}</div>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {submission.company_name}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            submission.submission_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : submission.submission_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.submission_status}
                          </span>
                        </td>

                        {/* MOA/RL Status */}
                        <td className="px-6 py-4 space-y-1 text-sm">
                          <div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              submission.moa_is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              MOA: {submission.moa_is_completed ? 'Generated' : 'Not Generated'}
                            </span>
                          </div>
                          <div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              submission.rl_is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              RL: {submission.rl_is_completed ? 'Generated' : 'Not Generated'}
                            </span>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div><span className="font-medium">Submitted:</span> {new Date(submission.submitted_at).toLocaleString()}</div>
                          <div><span className="font-medium">Updated:</span> {submission.updated_at ? new Date(submission.updated_at).toLocaleString() : '—'}</div>
                          <div><span className="font-medium">Reviewed:</span> {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleString() : '—'}</div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/coordinator/form2/view/${submission.submission_id}`)}
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => router.push(`/coordinator/form2/edit/${submission.submission_id}`)}
                              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleReviewSubmission(submission.submission_id, 'approved')}
                              className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewSubmission(submission.submission_id, 'rejected')}
                              className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-xs"
                            >
                              Reject
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
        </>
      )}
    </div>
  )
}