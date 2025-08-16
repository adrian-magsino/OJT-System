import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config/site";

const routes = [
  {name: "Home", path: "#Home"},
  {name: "About", path: "#About"}
]

export default function Header() {
  return (
    <header className="w-full h-header fixed bg-green-700 z-40">
      <nav className="mx-auto h-full flex items-center justify-between px-8 shadow-2xl">
        {/*CVSU LOGO */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 relative">
              <Image 
                src="/cvsu_logo.png"
                alt="CVSU Logo"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="text-white font-semibold text-sm md:text-base whitespace-nowrap">
              {siteConfig.name}
            </span>
          </a>         
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



      </nav>
    </header>
  );
}