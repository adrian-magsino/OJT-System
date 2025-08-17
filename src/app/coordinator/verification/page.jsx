"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getStudentsByProgramAction } from "@/lib/actions/coordinator-actions";

export default function VerificationPage() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const programs = [
    { value: "BSCS", label: "Bachelor of Science in Computer Science" },
    { value: "BSIT", label: "Bachelor of Science in Information Technology" }
  ];

  const statusFilters = [
    { value: "all", label: "All Students" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "unverified", label: "Unverified" }
  ];

  // Filter students based on status
  const filteredStudents = students.filter(student => {
    if (statusFilter === "all") return true;
    return student.verification_status === statusFilter;
  });

  // Fetch students when program is selected
  useEffect(() => {
    if (selectedProgram) {
      fetchStudents(selectedProgram);
    } else {
      setStudents([]);
    }
  }, [selectedProgram]);

  // Reset status filter when program changes
  useEffect(() => {
    setStatusFilter("all");
  }, [selectedProgram]);

  const fetchStudents = async (program) => {
    setLoadingStudents(true);
    try {
      const result = await getStudentsByProgramAction(program);
      if (result.success) {
        setStudents(result.data);
      } else {
        console.error('Error fetching students:', result.error);
        alert('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Please select a valid CSV file");
      event.target.value = "";
    }
  };

  const handleVerification = async () => {
    if (!selectedProgram) {
      alert("Please select a program");
      return;
    }
    if (!csvFile) {
      alert("Please upload a CSV file");
      return;
    }

    setIsLoading(true);
    // TODO: Implement verification logic
    setTimeout(() => {
      setIsLoading(false);
      alert("Verification process started!");
    }, 1000);
  };

  // Get status counts for display
  const getStatusCounts = () => {
    const verified = students.filter(s => s.verification_status === 'verified').length;
    const pending = students.filter(s => s.verification_status === 'pending').length;
    const unverified = students.filter(s => s.verification_status === 'unverified').length;
    return { verified, pending, unverified, total: students.length };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Verification
        </h1>
        <p className="text-gray-600">
          Import a CSV list of students and verify accounts by matching email addresses and student numbers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Program Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Program</h2>
          <div className="space-y-3">
            {programs.map((program) => (
              <label key={program.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="program"
                  value={program.value}
                  checked={selectedProgram === program.value}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{program.label} ({program.value})</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Students List */}
        {selectedProgram && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h2 className="text-xl font-semibold">
                {selectedProgram} Students ({filteredStudents.length} of {students.length})
              </h2>
              
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => {
                  const count = filter.value === "all" ? statusCounts.total : statusCounts[filter.value] || 0;
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        statusFilter === filter.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-4 gap-4 mb-4 text-center">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-lg font-semibold">{statusCounts.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-lg font-semibold text-green-800">{statusCounts.verified}</div>
                <div className="text-xs text-green-600">Verified</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-lg font-semibold text-yellow-800">{statusCounts.pending}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-lg font-semibold text-red-800">{statusCounts.unverified}</div>
                <div className="text-xs text-red-600">Unverified</div>
              </div>
            </div>

            {loadingStudents ? (
              <div className="text-center py-4">Loading students...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudents.map((student) => (
                    <div key={student.user_id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {student.name}</p>
                        <p><span className="font-medium">Email:</span> {student.email}</p>
                        <p><span className="font-medium">Student No.:</span> {student.student_number || 'N/A'}</p>
                        <p><span className="font-medium">Status:</span> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            student.verification_status === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : student.verification_status === 'unverified'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.verification_status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredStudents.length === 0 && students.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {statusFilter} students found for {selectedProgram}
                  </div>
                )}
                {students.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No students found for {selectedProgram}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* CSV File Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Student List</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                CSV File
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {csvFile && (
              <div className="text-sm text-green-600">
                ✓ File selected: {csvFile.name}
              </div>
            )}
            <div className="text-xs text-gray-500">
              <p>Expected CSV format:</p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                Email, Student Number, First Name, Last Name
              </code>
            </div>
          </div>
        </Card>

        {/* Verification Summary */}
        {selectedProgram && (
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Verification Summary</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Selected Program:</span> {selectedProgram}</p>
              <p><span className="font-medium">Students Found:</span> {students.length}</p>
              <p><span className="font-medium">Currently Viewing:</span> {statusFilter === 'all' ? 'All students' : `${statusFilter} students`} ({filteredStudents.length})</p>
              <p><span className="font-medium">CSV File:</span> {csvFile ? csvFile.name : "Not selected"}</p>
              <p className="text-gray-600 mt-3">
                The system will match student email addresses from the CSV with existing accounts,
                then verify student numbers for additional validation.
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setSelectedProgram("");
              setCsvFile(null);
              setStudents([]);
              setStatusFilter("all");
              document.getElementById("csvFile").value = "";
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            onClick={handleVerification}
            disabled={!selectedProgram || !csvFile || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Start Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}