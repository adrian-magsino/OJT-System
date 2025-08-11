import Link from "next/link";
import { getCurrentUserForm2Submission } from "@/lib/services/forms-service";

export default async function Form2Page(){
  const { data: submission, error, hasSubmission } = await getCurrentUserForm2Submission();

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            Error loading form submission
          </div>
          <p className="text-gray-600">{error.message}</p>
          <Link
            href="/student"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Student Training Information Sheet
          </h1>
          
          <SubmissionDetails 
            submission={submission} 
            hasSubmission={hasSubmission} 
          />
        </div>
      </div>
    </div>
  );
}

const SubmissionStatus = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          label: 'APPROVED'
        };
      case 'rejected':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          label: 'REJECTED'
        };
      case 'pending':
      default:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          label: 'PENDING'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

function SubmissionDetails({ submission, hasSubmission }) {
  if (hasSubmission) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Form Already Submitted
          </h2>
          <p className="text-green-700 mb-4">
            You have successfully submitted your application form.
          </p>
          <div className="space-y-2 text-sm text-green-600">
            <div className="flex items-center justify-center">
              <strong className="mr-2">Status:</strong>
              <SubmissionStatus status={submission?.submission_status} />
            </div>
            
            <p><strong>Submitted:</strong> {new Date(submission?.submitted_at).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</p>
            <p><strong>Updated:</strong> {new Date(submission?.updated_at).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</p>
            {submission?.reviewed_at && (
              <p><strong>Reviewed:</strong> {new Date(submission?.reviewed_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/student/forms/edit"
            className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Your Submission
          </Link>
          
          <div>
            <Link
              href="/student"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          No Form Submitted Yet
        </h2>
        <p className="text-blue-700 mb-4">
          You haven't submitted your application form. Please fill out the required information to apply for your OJT placement.
        </p>
      </div>
      
      <div className="space-y-4">
        <Link
          href="/student/forms/edit"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Fill Out Application Form
        </Link>
        
        <div>
          <Link
            href="/student"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}