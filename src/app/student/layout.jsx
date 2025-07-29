import Footer from "@/components/layout/public/Footer";
import StudentHeader from "@/components/layout/student/Header";
import StudentHeaderWrapper from "@/components/layout/student/HeaderWrapper";
import Sidebar from "@/components/ui/student/Sidebar";


export default function StudentLayout({ children }){
  return (
    <div>
      <StudentHeaderWrapper />

      <div className="pt-12">
        <Sidebar />
        <main className="sm:ml-64"> {/* Left margin based on Sidebar's */}
          {children}
        </main>
      </div>
    </div>
  );
}