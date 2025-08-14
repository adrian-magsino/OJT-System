'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerificationRequiredPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'pending'

  useEffect(() => {
    // Show browser alert
    const message = getAlertMessage(status)
    alert(message)
  }, [status])

  const getAlertMessage = (verificationStatus) => {
    switch(verificationStatus) {
      case 'rejected':
        return 'Unverified students cannot access Forms. Your verification was rejected.'
      case 'pending':
        return 'Unverified students cannot access Forms. Your verification is pending approval.'
      default:
        return 'Unverified students cannot access Forms. Please complete your verification.'
    }
  }

  const getStatusMessage = (verificationStatus) => {
    switch(verificationStatus) {
      case 'rejected':
        return {
          title: 'Verification Rejected',
          message: 'Your account verification was rejected. Please contact your OJT coordinator.',
          color: 'red'
        }
      case 'pending':
        return {
          title: 'Verification Pending',
          message: 'Your account verification is pending approval from the OJT coordinator.',
          color: 'yellow'
        }
      default:
        return {
          title: 'Verification Required',
          message: 'You need to complete your verification to access forms.',
          color: 'blue'
        }
    }
  }

  const statusInfo = getStatusMessage(status)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Icon */}
          <div className={`mx-auto h-16 w-16 mb-4 ${
            statusInfo.color === 'red' ? 'text-red-400' :
            statusInfo.color === 'yellow' ? 'text-yellow-400' :
            'text-blue-400'
          }`}>
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {statusInfo.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {statusInfo.message}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link 
              href="/student"
              className="w-full block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link 
              href="/student/profile"
              className="w-full block py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}