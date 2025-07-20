import Footer from "@/components/layout/public/Footer";
import StudentHeader from "@/components/layout/student/Header";


export default function StudentLayout({ children }){
  return (
    <>
      <StudentHeader />
      <div className="pt-12">
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}