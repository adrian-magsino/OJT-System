import CoordinatorHeader from "@/components/layout/coordinator/Header";


export default function CoordinatorLayout({ children }){
  return (
    <>
      {/*Header Component for OJTCoordinator interface*/}
      <CoordinatorHeader />
      <main className="pt-12">
        {children}
      </main>
    </>
  );
}