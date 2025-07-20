//ROOT LANDING PAGE

import Home from "./(public)/home/page";
import About from "./(public)/about/page";
import Header from "@/components/layout/public/Header";
import Footer from "@/components/layout/public/Footer";

export default function Main() {
  return (
    <>
      <Header />
      <div className="pt-12">
        <main>
          <Home />
          <About />
        </main>
      </div>
      <Footer />
    </>
    
  );
}
