"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  getStudentsByProgramAction,
  getVerifiedStudentsAction,
  addVerifiedStudentAction,
  addVerifiedStudentsBulkAction,
  removeVerifiedStudentAction
} from "@/lib/actions/coordinator-actions";

export default function VerificationPage() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Verified students state
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [loadingVerifiedStudents, setLoadingVerifiedStudents] = useState(false);
  
  // Manual add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ email: "", studentNumber: "" , program: "" });
  
  // CSV upload state
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Load verified students on component mount
  useEffect(() => {
    fetchVerifiedStudents();
  }, []);

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

  const fetchVerifiedStudents = async () => {
    setLoadingVerifiedStudents(true);
    try {
      const result = await getVerifiedStudentsAction();
      if (result.success) {
        setVerifiedStudents(result.data);
      } else {
        console.error('Error fetching verified students:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingVerifiedStudents(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.email || !newStudent.studentNumber || !newStudent.program) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await addVerifiedStudentAction(newStudent.email, newStudent.studentNumber, newStudent.program);
      if (result.success) {
        setNewStudent({ email: "", studentNumber: "", program: "" });
        setShowAddForm(false);
        fetchVerifiedStudents();
        alert('Student added successfully');
      } else {
        alert(result.error?.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add student');
    }
  };

  const handleRemoveStudent = async (id) => {
    if (!confirm('Are you sure you want to remove this student?')) return;

    try {
      const result = await removeVerifiedStudentAction(id);
      if (result.success) {
        fetchVerifiedStudents();
        alert('Student removed successfully');
      } else {
        alert(result.error?.message || 'Failed to remove student');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove student');
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

  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header if it exists
      const dataLines = lines.slice(1);
      
      const studentsData = dataLines.map(line => {
        const [email, studentNumber, program] = line.split(',').map(item => item.trim());
        return { email, student_number: studentNumber, program };
      }).filter(student => student.email && student.student_number && student.program);

      if (studentsData.length === 0) {
        alert('No valid student data found in CSV');
        return;
      }

      const result = await addVerifiedStudentsBulkAction(studentsData);
      if (result.success) {
        const { success_count, error_count, errors } = result.data;
        fetchVerifiedStudents();
        setCsvFile(null);
        document.getElementById("csvFile").value = "";
        
        let message = `Successfully added ${success_count} students.`;
        if (error_count > 0) {
          message += `\n${error_count} errors occurred:\n${errors.join('\n')}`;
        }
        alert(message);
      } else {
        alert(result.error?.message || 'Failed to upload students');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerification = async () => {
    if (!selectedProgram) {
      alert("Please select a program");
      return;
    }

    // TODO: Implement actual verification logic
    alert("Verification process started!");
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
          Manage verified student list and verify accounts by matching email addresses and student numbers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Verified Students Management */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold">
              Verified Students List ({verifiedStudents.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="flex gap-4 items-end flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
                  <input
                    type="text"
                    value={newStudent.studentNumber}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, studentNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <select
                    value={newStudent.program}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.value} value={program.value}>
                        {program.value}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStudent({ email: "", studentNumber: "", program: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* CSV Upload Section */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-3">Bulk Upload via CSV</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {csvFile && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-600">
                    ✓ File selected: {csvFile.name}
                  </div>
                  <button
                    onClick={handleCsvUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload CSV"}
                  </button>
                </div>
              )}
              <div className="text-xs text-gray-500">
                <p>Expected CSV format (with header):</p>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  Email, Student Number, Program
                </code>
              </div>
            </div>
          </div>

          {/* Verified Students Table */}
          {loadingVerifiedStudents ? (
            <div className="text-center py-4">Loading verified students...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Program</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Added Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.student_number}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.program === 'BSCS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {student.program}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {verifiedStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No verified students found. Add students using the form above or upload a CSV file.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Program Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Program for Verification</h2>
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

        {/* Verification Summary */}
        {selectedProgram && (
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Verification Summary</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Selected Program:</span> {selectedProgram}</p>
              <p><span className="font-medium">Students Found:</span> {students.length}</p>
              <p><span className="font-medium">Currently Viewing:</span> {statusFilter === 'all' ? 'All students' : `${statusFilter} students`} ({filteredStudents.length})</p>
              <p><span className="font-medium">Verified Students in List:</span> {verifiedStudents.length}</p>
              <p className="text-gray-600 mt-3">
                The system will match student email addresses from the verified list with existing accounts,
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
              setStudents([]);
              setStatusFilter("all");
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            onClick={handleVerification}
            disabled={!selectedProgram}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Verification
          </button>
        </div>
      </div>
    </div>
  );
}