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
          <a href="/">WEBSITE LOGO</a>         
        </div>

        {/* HEADER NAVIGATION */}
        <div className="flex gap-x-12">
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