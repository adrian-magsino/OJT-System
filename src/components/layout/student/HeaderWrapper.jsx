import { getCurrentUser } from "@/lib/services/user-service";
import { getCurrentStudentProfile } from "@/lib/services/student-service";
import StudentHeader from "./Header";

export default async function StudentHeaderWrapper() {
  const { user, error } = await getCurrentUser();

  if (error) {
    console.error("Error fetching user:", error);
    return <StudentHeader user={user} error={error} student={null} />
  }

  // If user is a student, fetch their profile data including profile picture
  let student = null;
  if (user && user.role === "student") {
    const { student: studentData, error: studentError } = await getCurrentStudentProfile();
    if (!studentError) {
      student = studentData;
    }
  }

  return <StudentHeader user={user} error={error} student={student} />
}