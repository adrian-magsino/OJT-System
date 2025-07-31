'use client'
import React, { useEffect, useState } from 'react';
import { getForm2Submissions } from '@/lib/services/forms-service';

const CoordinatorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await getForm2Submissions();

      if (error) {
        console.error('Error fetching submissions:', error.message);
        setError(error);
      } else {
        setSubmissions(data);
      }

      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Coordinator Dashboard</h2>

      {loading && (
        <div className="grid gap-4">
          <div className="animate-pulse h-24 bg-gray-200 rounded-md" />
          <div className="animate-pulse h-24 bg-gray-200 rounded-md" />
          <div className="animate-pulse h-24 bg-gray-200 rounded-md" />
        </div>
      )}

      {error && <p className="text-red-500">Error loading submissions.</p>}

      {!loading && !error && submissions.length === 0 && (
        <p className="text-gray-500">No submissions found.</p>
      )}

      {!loading && !error && submissions.length > 0 && (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-xl border bg-white shadow p-5 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {submission.student_profiles.full_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {submission.student_profiles.email}
                  </p>
                </div>
                <button
                  className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100 transition"
                  onClick={() => console.log('View Details clicked')}
                >
                  View Details
                </button>
              </div>
              <div className="text-sm">
                <span className="font-medium">HTE:</span> {submission.hte.name} — {submission.hte.location}
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {submission.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoordinatorDashboard;
