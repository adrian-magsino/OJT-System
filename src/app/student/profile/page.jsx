//STUDENT PROFILE PAGE

import InfoField from "@/components/ui/InfoField";
import { getCurrentStudentProfile } from "@/lib/services/student-service";


export default async function StudentProfile() {
  const { student, error } = await getCurrentStudentProfile();

  /* SAMPLE DATA ONLY
  const displayName = "Eren Yeager"
  const student_data = {
    name: displayName,
    email: "main.eren.yeager@cvsu.edu.ph",
    program: "Bachelor of Science in Computer Science",
    age: "999",
    birthdate: "January 1, 2025",
    contactnum: "+123 456 789",
    country: "Philippines"
  }
    */
  
  if (error || !student) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading profile: {error?.message || "Student profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex gap-[20px] flex-row flex-wrap bg-green-200">

        {/*Main Info Container*/}
        <div className="w-full min-h-30 grow bg-white border-2 mx-10 mt-10 flex flex-row">
          
          {/*Profile Container */}
          <div className="p-15">
            <div className="flex flex-col items-center gap-5">
              <div data-component="avatar" className="bg-amber-300 w-30 h-30 rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-semibold text-3xl">{student.name?.toUpperCase().trim()[0]}</span> {/* DISPLAY INITIAL IF THERE'S NO IMAGE */}
              </div>
              <span className="text-gray-800 font-medium text-2xl">{student.name}</span>
              <span className="text-gray-800 font-medium">ADDITIONAL INFO</span>
              <span className="text-gray-800 font-medium">ADDITIONAL INFO 2</span>
            </div>
          </div>

          {/*Personal Info Container */}
          <div className="grow">
            <div className="mt-8 mx-6">
              <span className="text-bold text-xl">USER DETAILS</span>
            </div>
            
            <div className="grid grid-cols-2 gap-10 px-8 py-8">
              <InfoField label="Email" value={student.email}/>
              <InfoField label="Program" value={student.program}/>
              <InfoField label="Student Number" value={student.student_number}/>
            </div>
            
          </div>
        </div>
        {/*Skills and Interests*/}
        <div className="w-full min-h-30 grow bg-white border-2 mx-10">SKILLS AND INTERESTS</div>
        
        {/*Other Info Container*/}
        <div className="w-full min-h-30 grow bg-white border-2 mx-10">OTHER INFORMATION</div>
      </div>
    </div>
    
  );
}