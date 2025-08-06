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
        <div className="flex gap-4 mb-4">
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

      {/* Submissions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Student Name</th>
              <th className="px-4 py-2 border">Student Number</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">MOA Generated</th>
              <th className="px-4 py-2 border">Rec Letter Generated</th>
              <th className="px-4 py-2 border">Submitted At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">No submissions found.</td>
              </tr>
            ) : (
              filteredSubmissions.map((submission) => (
                <tr key={submission.submission_id}>
                  <td className="px-4 py-2 border">{submission.student_name}</td>
                  <td className="px-4 py-2 border">{submission.student_number}</td>
                  <td className="px-4 py-2 border">{submission.company_name}</td>
                  <td className="px-4 py-2 border">{submission.submission_status}</td>
                  <td className="px-4 py-2 border">
                    {submission.has_moa ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-2 border">
                    {submission.has_recommendation_letter ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {submission.updated_at ? new Date(submission.updated_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => reviewSubmission(submission.submission_id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewSubmission(submission.submission_id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => generateDocument(submission.submission_id, 'moa')}
                        disabled={
                          submission.submission_status !== 'approved' || submission.has_moa
                        }
                        className={`px-2 py-1 rounded text-sm text-white ${
                          submission.submission_status !== 'approved' || submission.has_moa
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        Generate MOA
                      </button>

                      <button
                        onClick={() => generateDocument(submission.submission_id, 'recommendation_letter')}
                        disabled={
                          submission.submission_status !== 'approved' || submission.has_recommendation_letter
                        }
                        className={`px-2 py-1 rounded text-sm text-white ${
                          submission.submission_status !== 'approved' || submission.has_recommendation_letter
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                      >
                        Generate Rec Letter
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
