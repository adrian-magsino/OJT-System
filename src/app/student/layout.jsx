
import StudentHeaderWrapper from "@/components/layout/student/HeaderWrapper";
import Sidebar from "@/components/ui/student/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarProvider";
import SidebarLayout from "@/components/layout/SidebarLayout";

export default function StudentLayout({ children }){
  return (
    <SidebarProvider>
      <div>
        <StudentHeaderWrapper />
        <div className="pt-12">
          <Sidebar />
          <SidebarLayout>
            {children}
          </SidebarLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}