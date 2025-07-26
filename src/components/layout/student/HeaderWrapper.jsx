import { getCurrentUser } from "@/lib/services/user-service";
import StudentHeader from "./Header";

export default async function StudentHeaderWrapper() {
  const { user, error } = await getCurrentUser();

  if (error) {
    console.error("Error fetching user:", error);
  } 

  return <StudentHeader user={user} />
}