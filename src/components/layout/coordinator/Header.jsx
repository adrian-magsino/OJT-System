import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config/site";
import { PanelsTopLeft, LayoutList, BookText, Users } from "lucide-react"


const routes = [
  {name: "Dashboard", path: "/coordinator", icon: PanelsTopLeft },
  {name: "Hte List", path: "/coordinator/hte", icon: LayoutList },
  {name: "Form Submissions", path: "/coordinator/form2", icon: BookText },
  {name: "Student List", path:"/coordinator/verification", icon: Users}
]
export default function CoordinatorHeader() {

  return (
    <header className="w-full h-header fixed bg-green-700 z-40">
      <nav className="mx-auto h-full flex items-center justify-between px-8">
        {/*CVSU LOGO */}
        <div className="flex items-center gap-3 ml-4 lg:ml-0">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
          </Link>         
        </div>

        {/* HEADER NAVIGATION */}
        <div className="flex gap-x-12">
          {routes.map(({name, path, icon: Icon}) => (
            <Link
              key={name}
              href={path}
              className="text-white hover:text-yellow-400 flex flex-row gap-1 items-center"
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden="true"/>
              <span>{name}</span>
            </Link>
          ))}
        </div>



      </nav>
    </header>
  );
}