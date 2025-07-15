import Header from "../components/layout/Header";


export default function PublicLayout({ children }){
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}