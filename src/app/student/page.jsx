//STUDENT MAIN/HOME PAGE (DASHBOARD MAYBE?)

import HteCard from "@/components/ui/HteCard";
import Sidebar from "@/components/ui/student/Sidebar";


export default function StudentDashboard() {
  return (
    <div className="w-full min-h-screen flex">

      <div className="flex flex-col gap-3">
        
        <HteCard />
        <HteCard />
        <HteCard />
      </div>
    </div>
  );
}
