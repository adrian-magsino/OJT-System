'use client'

import { useState } from "react";
import InfoField from "../InfoField";
import { Pencil } from "lucide-react";

export default function StudentDetailsSection({student, onSave}) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <>
      {student.verification_status.toLowerCase() === "verified" ? (
        <div className="flex gap-15 px-8 py-8">
          <InfoField label="Email" value={student.email}/>
          <InfoField label="Program" value={student.program}/>
          <InfoField label="Student Number" value={student.student_number}/>
        </div>
      ) : (
        <div className="px-8 py-2">
          {!isEditing ? (
            <div>
              <div className="flex gap-15 mb-4">
                <InfoField label="Email" value={student.email}/>
                <InfoField label="Program" value={student.program || "Not set"}/>
                <InfoField label="Student Number" value={student.student_number || "Not set"}/>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-green-700 text-sm rounded hover:underline"
              >
                <div className="flex flex-row gap-2"><Pencil size={16}/> Edit</div>
              </button>
            </div>
          ) : (
            <form action={onSave} className="flex flex-col gap-6 max-w-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    disabled
                    value={student.email}
                    className="border rounded px-3 py-2 bg-gray-100 text-gray-600 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="program" className="text-xs font-semibold text-gray-600 mb-1">Program</label>
                  <input
                    id="program"
                    name="program"
                    required
                    defaultValue={student.program || ""}
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Program"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="student_number" className="text-xs font-semibold text-gray-600 mb-1">Student Number</label>
                  <input
                    id="student_number"
                    name="student_number"
                    required
                    defaultValue={student.student_number || ""}
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Student Number"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={() => setIsEditing(false)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                Once verified, Program and Student Number become locked.
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
};