import Footer from "@/components/layout/public/Footer";
import StudentHeader from "@/components/layout/student/Header";


export default function StudentLayout({ children }){
  return (
    <>
      <StudentHeader />
      <div>
      {/*STUDENT SIDEBAR OR SOMETHING*/ }  
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}