import Link from "next/link";

export default function Sidebar() {
  const linkClasses = "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group";

  return (
    <div className="fixed z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-200">
        <ul className="space-y-2 font-medium">
          <li>
            <Link href="/student" className={linkClasses}>
              <span className="ms-3">DASHBOARD</span>
            </Link>
          </li>
          <li>
            <Link href="/student/forms" className={linkClasses}>
              <span className="ms-3">PAGE 2</span>
            </Link>
          </li>
          <li>
            <Link  href="#" className={linkClasses}>
              <span className="ms-3">PAGE 3</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}