import Link from "next/link";


const routes = [
  {name: "Home", path: "/"},
  {name: "Login", path: "/login"},
  {name: "About", path: "/about"}
]


export default function Header() {
  return (
    <header className="w-full fixed bg-green-700 z-40">
      <nav className="mx-auto flex items-center justify-between px-8">
        <div>
          CVSU LOGO
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.path}
              className="text-white hover:text-yellow-400"
            >
              {route.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}