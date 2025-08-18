'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  fetchSubmissionsAction,
  generateDocumentAction
} from '@/lib/actions/coordinator-actions'

export default function GenerateRLClientComponent({ initialSubmissions }) {
  const supabase = createClient()
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions || [])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('approved')
  const [rlFilter, setRlFilter] = useState('not_generated')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Selection states
  const [selectedSubmissions, setSelectedSubmissions] = useState(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const result = await fetchSubmissionsAction()
      
      if (result.success) {
        setSubmissions(result.data || [])
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

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('form2_submissions_rl')
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

  // Filter submissions based on criteria
  const filteredSubmissions = Array.isArray(submissions) ? submissions.filter(submission => {
    const matchesStatus = statusFilter === 'all' || submission.submission_status === statusFilter
    const matchesRL = rlFilter === 'all' || 
      (rlFilter === 'generated' && submission.rl_is_completed) ||
      (rlFilter === 'not_generated' && !submission.rl_is_completed)
    const matchesSearch =
      submission.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.company_name?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesRL && matchesSearch
  }) : []

  // Handle individual checkbox selection
  const handleSubmissionSelect = (submissionId) => {
    const newSelected = new Set(selectedSubmissions)
    if (newSelected.has(submissionId)) {
      newSelected.delete(submissionId)
    } else {
      newSelected.add(submissionId)
    }
    setSelectedSubmissions(newSelected)
    setSelectAll(newSelected.size === filteredSubmissions.length)
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubmissions(new Set())
      setSelectAll(false)
    } else {
      const allIds = new Set(filteredSubmissions.map(sub => sub.submission_id))
      setSelectedSubmissions(allIds)
      setSelectAll(true)
    }
  }

  // Update select all state when filtered submissions change
  useEffect(() => {
    if (filteredSubmissions.length === 0) {
      setSelectAll(false)
    } else {
      setSelectAll(filteredSubmissions.every(sub => selectedSubmissions.has(sub.submission_id)))
    }
  }, [filteredSubmissions, selectedSubmissions])

  // Generate recommendation letters
  const generateSelectedRL = async () => {
    if (selectedSubmissions.size === 0) {
      alert('Please select at least one submission to generate recommendation letters.')
      return
    }

    setGenerating(true)
    
    try {
      // Get the selected submission data
      const selectedData = filteredSubmissions.filter(sub =>
        selectedSubmissions.has(sub.submission_id)
      )

      console.log('Generating RL for submissions:', selectedData.map(s => s.submission_id))

      // Call the API to generate the PDF
      const response = await fetch('/api/generate-rl', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ submissions: selectedData }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recommendation_letters_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Mark documents as generated in the database
      let successCount = 0
      let errorCount = 0

      for (const submissionId of selectedSubmissions) {
        try {
          const result = await generateDocumentAction(submissionId, 'recommendation_letter')
          if (result.success) {
            successCount++
          } else {
            console.error(`Error marking RL as generated for submission ${submissionId}:`, result.error)
            errorCount++
          }
        } catch (error) {
          console.error(`Error marking RL as generated for submission ${submissionId}:`, error)
          errorCount++
        }
      }

      // Refresh the submissions list
      await fetchSubmissions()
      
      // Clear selections
      setSelectedSubmissions(new Set())
      setSelectAll(false)

      // Show success message
      if (errorCount === 0) {
        alert(`Successfully generated and downloaded recommendation letters for ${successCount} submission(s)!`)
      } else {
        alert(`Generated PDF but had ${errorCount} error(s) updating database records. Downloaded ${successCount} recommendation letter(s).`)
      }

    } catch (error) {
      console.error('Error generating recommendation letters:', error)
      alert(`Error generating recommendation letters: ${error.message}`)
    } finally {
      setGenerating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Link 
            href="/coordinator"
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center text-sm"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Generate Recommendation Letters</h1>
          <p className="text-gray-600 mt-1">Select submissions to generate recommendation letters in bulk</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={generateSelectedRL}
            disabled={selectedSubmissions.size === 0 || generating}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedSubmissions.size === 0 || generating
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {generating ? 'Generating...' : `Generate Selected (${selectedSubmissions.size})`}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">RL Status Filter</label>
              <select
                value={rlFilter}
                onChange={(e) => setRlFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All RL Status</option>
                <option value="not_generated">Not Generated</option>
                <option value="generated">Generated</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name, number, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-md w-full sm:w-64"
              />
            </div>
          </div>
          
          {filteredSubmissions.length > 0 && (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
              Showing {filteredSubmissions.length} submission(s)
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-lg">Loading submissions...</div>
        </div>
      ) : (
        <>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
              No submissions found matching the current filters.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-xs font-medium text-gray-500 uppercase">Select All</span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RL Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.submission_id} className="hover:bg-gray-50">
                        {/* Checkbox */}
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.has(submission.submission_id)}
                            onChange={() => handleSubmissionSelect(submission.submission_id)}
                            disabled={submission.submission_status !== 'approved' || submission.rl_is_completed}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                          />
                        </td>

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
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.submission_status)}`}>
                            {submission.submission_status?.charAt(0).toUpperCase() + submission.submission_status?.slice(1)}
                          </span>
                        </td>

                        {/* RL Status */}
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            submission.rl_is_completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {submission.rl_is_completed ? 'Generated' : 'Not Generated'}
                          </span>
                        </td>

                        {/* Submitted Date */}
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
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