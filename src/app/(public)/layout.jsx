import Header from "../components/layout/Header";


export default function PublicLayout({ children }){
  return (
    <>
      <main>
        {children}
      </main>
    </>
  );
}