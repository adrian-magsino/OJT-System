'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  fetchSubmissions as fetchSubmissionsAction,
  reviewSubmission as reviewSubmissionAction,
  generateDocument as generateDocumentAction
} from '@/lib/actions/coordinator-actions'

export default function Forms2ClientComponent({ initialSubmissions, user }) {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await fetchSubmissionsAction()
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const reviewSubmission = async (submissionId, status) => {
    try {
      await reviewSubmissionAction(submissionId, status)
      await fetchSubmissions()
      alert(`Submission ${status} successfully!`)
    } catch (error) {
      console.error('Error reviewing submission:', error)
      alert('Error updating submission status')
    }
  }

  const generateDocument = async (submissionId, documentType) => {
    try {
      await generateDocumentAction(submissionId, documentType)
      await fetchSubmissions()
      alert(`${documentType.toUpperCase()} generated successfully!`)
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Error generating document')
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('form2_submissions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_form2_submissions'
      }, () => {
        fetchSubmissions()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Form 2 Submissions</h1>
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
                        <td className="px-6 py-4 space-y-2 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => reviewSubmission(submission.submission_id, 'approved')}
                              className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reviewSubmission(submission.submission_id, 'rejected')}
                              className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => generateDocument(submission.submission_id, 'moa')}
                              disabled={submission.submission_status !== 'approved' || submission.moa_is_completed}
                              className={`px-2 py-1 rounded text-xs text-white flex-1 ${
                                submission.submission_status !== 'approved' || submission.moa_is_completed
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            >
                              Generate MOA
                            </button>
                            <button
                              onClick={() => generateDocument(submission.submission_id, 'recommendation_letter')}
                              disabled={submission.submission_status !== 'approved' || submission.rl_is_completed}
                              className={`px-2 py-1 rounded text-xs text-white flex-1 ${
                                submission.submission_status !== 'approved' || submission.rl_is_completed
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-purple-500 hover:bg-purple-600'
                              }`}
                            >
                              Generate RL
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
