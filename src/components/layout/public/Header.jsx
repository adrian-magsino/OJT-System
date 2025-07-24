import Link from "next/link";
import Image from "next/image";

const routes = [
  {name: "Home", path: "#Home"},
  {name: "About", path: "#About"}
]

export default function Header() {
  return (
    <header className="w-full h-12 fixed bg-green-700 z-40">
      <nav className="mx-auto h-full flex items-center justify-between px-8">
        <div>
          <a href="/">CVSU LOGO</a>
          
        </div>

        {/* MENU BUTTON FOR SMALLER SCREENS */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Main Menu</span>
            <Image alt="" src="/icons/menu_button.svg" width={40} height={40}/> 
          </button>
        </div>

        {/* HEADER NAVIGATION */}
        <div className="hidden lg:flex lg:gap-x-12">
          {routes.map((route) => (
            <a
              key={route.name}
              href={route.path}
              className="text-white hover:text-yellow-400"
            >
              {route.name}
            </a>
          ))}
        </div>

        {/* Logout button */}


      </nav>
    </header>
  );
}