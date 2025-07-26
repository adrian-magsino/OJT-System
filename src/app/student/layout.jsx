import Footer from "@/components/layout/public/Footer";
import StudentHeader from "@/components/layout/student/Header";
import StudentHeaderWrapper from "@/components/layout/student/HeaderWrapper";
import Sidebar from "@/components/ui/student/Sidebar";


export default function StudentLayout({ children }){
  return (
    <>
      <StudentHeaderWrapper />
      
      <div className="pt-12 pb-10">
        <Sidebar />
        <main className=" sm:ml-64">
          {children}
        </main>
      </div>

      <div className="sm:ml-64"> 
        <Footer />
      </div>

    </>
  );
}