//STUDENT PROFILE PAGE

import InfoField from "@/components/ui/InfoField";
import InterestsEditor from "@/components/ui/student/InterestsEditor";
import SpecializationEditor from "@/components/ui/student/SpecializationEditor";
import ProfilePictureEditor from "@/components/ui/student/ProfilePIctureEditor";
import { updateInterestsField, updateSpecializationsField, updateProfilePicture } from "@/lib/actions/student-actions";
import { getCurrentStudentProfile } from "@/lib/services/student-service";
import { errorFallback } from "@/lib/utils/error/error-handler";


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
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10 mt-10 flex flex-row">
          
          {/*Profile Container */}
          <div className="p-15">
             <ProfilePictureEditor
              currentProfilePicture={student.profile_picture_url}
              studentName={student.name}
              onSave={updateProfilePicture}
            />
            <div className="flex flex-col items-center gap-5">
              
              <span className="text-gray-800 font-medium text-2xl">{student.name}</span>
              <span className="text-gray-800 font-medium">Verification Status: {student.verification_status}</span>
            </div>
          </div>

          {/*Personal Info Container */}
          <div className="grow">
            <div className="mt-8 mx-6">
              <span className="text-bold text-xl">STUDENT DETAILS</span>
            </div>
            
            <div className="grid grid-cols-2 gap-10 px-8 py-8">
              <InfoField label="Email" value={student.email}/>
              <InfoField label="Program" value={student.program}/>
              <InfoField label="Student Number" value={student.student_number}/>
            </div>
            
          </div>
        </div>
        {/*Skills and Specializations Section*/}
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10">
          <h3 className="ml-2 mt-2 font-bold">SKILLS AND SPECIALIZATIONS</h3>

          <SpecializationEditor
            initialSpecializations={student.specializations || []} 
            onSave={updateSpecializationsField}
          />

        </div>

        {/*Interests Section*/}
        <div className="w-full min-h-30 grow bg-white border-1 border-gray-200 mx-10 mb-5">
          <h3 className="ml-2 mt-2 font-bold">INTERESTS</h3>

          <InterestsEditor 
            initialInterests={student.interests || []}
            onSave={updateInterestsField}
          />

        </div>
        
      </div>
    </div>
    
  );
}