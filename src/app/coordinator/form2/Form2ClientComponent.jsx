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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Form 2 Submissions</h1>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by student name, number, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Submissions Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions.length === 0 ? (
          <div className="col-span-full text-center py-4 text-gray-500">
            No submissions found.
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.submission_id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-row items-center justify-between gap-4"
            >
              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{submission.student_name}</h3>
                <p className="text-sm text-gray-600">Student Number: {submission.student_number}</p>
              </div>

              {/* Company and Status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  <span className="font-medium">Company:</span> {submission.company_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-0.3 rounded-full text-xs font-medium ${
                      submission.submission_status === 'pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : submission.submission_status === 'approved'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {submission.submission_status}
                  </span>
                </p>
              </div>

              {/* Document Status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">MOA:</span>{' '}
                  <span
                    className={`inline-block px-2 py-0.2 rounded-full text-xs font-medium ${
                      submission.moa_is_completed
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {submission.moa_is_completed ? 'Generated' : 'Not Generated Yet'}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Rec Letter:</span>{' '}
                  <span
                    className={`inline-block px-2 py-0.2 rounded-full text-xs font-medium ${
                      submission.rl_is_completed
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {submission.rl_is_completed ? 'Generated' : 'Not Generated Yet'}
                  </span>
                </p>
              </div>

              {/* Dates */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">Submitted:</span>{' '}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Updated:</span>{' '}
                  {submission.updated_at ? new Date(submission.updated_at).toLocaleString() : '—'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[160px]">
                <div className="flex gap-2">
                  <button
                    onClick={() => reviewSubmission(submission.submission_id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reviewSubmission(submission.submission_id, 'rejected')}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex-1"
                  >
                    Reject
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateDocument(submission.submission_id, 'moa')}
                    disabled={
                      submission.submission_status !== 'approved' || submission.moa_is_completed
                    }
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
                    disabled={
                      submission.submission_status !== 'approved' || submission.rl_is_completed
                    }
                    className={`px-2 py-1 rounded text-xs text-white flex-1 ${
                      submission.submission_status !== 'approved' || submission.rl_is_completed
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    Generate Rec Letter
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}