'use client'

import { Suspense } from 'react'
import VerificationRequiredContent from './VerificationRequiredContent'

function VerificationRequiredFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-blue-400 mx-auto h-16 w-16 mb-4">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we check your verification status.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerificationRequiredPage() {
  return (
    <Suspense fallback={<VerificationRequiredFallback />}>
      <VerificationRequiredContent />
    </Suspense>
  )
}