//STUDENT PROFILE PAGE

import InfoField from "@/components/ui/InfoField";
import InterestsEditor from "@/components/ui/student/InterestsEditor";
import SpecializationEditor from "@/components/ui/student/SpecializationEditor";
import StudentDetailsSection from "@/components/ui/student/EditStudentProfile";
import { updateInterestsField, updateSpecializationsField, updateProgramAndStudentNumber } from "@/lib/actions/student-actions";
import { getCurrentStudentProfile } from "@/lib/services/student-service";
import { errorFallback } from "@/lib/utils/error/error-handler";
import Image from "next/image";



export default async function StudentProfile() {
  const { student, error } = await getCurrentStudentProfile();

  if (error) {
    errorFallback(
      error.message,
      "/student",
      "Go back to Dashboard"
    )
  }
  if (error || !student) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Student profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex gap-[20px] flex-row flex-wrap bg-gray-50">

        {/*Main Info Container*/}
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10 mt-10 flex flex-row items-center">
          
          {/*Profile Container */}
          <div className="py-15 pl-15 pr-6">
            {/* Simple profile picture display */}
            <div 
              data-component="avatar" 
              className="bg-amber-300 w-30 h-30 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200"
            >
              {student.profile_picture_url ? (
                <Image
                  src={student.profile_picture_url}
                  alt={`${student.name}'s profile picture`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  sizes="120px"
                />
              ) : (
                <span className="text-gray-800 font-semibold text-3xl">
                  {student.name?.toUpperCase().trim()[0]}
                </span>
              )}
            </div>
              
              

          </div>

          {/*Personal Info Container */}
          <div className="grow">
            <div className="mt-8 flex flex-row items-center gap-3 ">
              <div className="text-gray-800 font-medium text-3xl">{student.name}</div>
              {student.verification_status.toLowerCase() === "verified" ? (
                <div className="text-white rounded-full text-xs bg-green-500 px-2 py-1 inline-block">VERIFIED</div>
              ):(
                <div className="text-white rounded-full text-xs bg-red-500 px-2 py-1 inline-block">UNVERIFIED</div>
              )}
            </div>
            
            <StudentDetailsSection student={student} onSave={updateProgramAndStudentNumber}/>
            
          </div>
        </div>
        {/*Skills and Specializations Section*/}
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10 p-2">
          <h3 className="ml-2 mt-2 font-bold text-green-800">SKILLS AND SPECIALIZATIONS</h3>

          <SpecializationEditor
            initialSpecializations={student.specializations || []} 
            onSave={updateSpecializationsField}
          />

        </div>

        {/*Interests Section*/}
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10 p-2 mb-5">
          <h3 className="ml-2 mt-2 font-bold text-green-800">INTERESTS</h3>

          <InterestsEditor 
            initialInterests={student.interests || []}
            onSave={updateInterestsField}
          />

        </div>
        
      </div>
    </div>
    
  );
}