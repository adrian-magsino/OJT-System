//STUDENT HEADER COMPONENT

"use client"

import Link from "next/link";
import LogoutButton from '@/components/auth/LogoutButton'

export default function StudentHeader({ user }) {
  const user_name = user?.name || "Guest User"

  return (
    <header className="w-full h-12 fixed bg-green-700 z-40">
      <nav className="mx-auto h-full flex items-center justify-between px-8">
        {/* WEBSITE LOGO */}
        <div>
          <Link href="/">WEBSITE LOGO</Link>
          
        </div>

        {/* PROFILE BUTTON */}
        <Link href="/student/profile" className="hover:bg-green-600 rounded-lg transition-colors">
          <div className="flex flex-row items-center gap-3">
            <div data-component="avatar" className="bg-amber-300 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-semibold text-sm">{user_name.toUpperCase().trim()[0]}</span> {/* DISPLAY INITIAL IF THERE'S NO IMAGE */}
            </div>
            <span className="text-white font-medium">{user_name.toUpperCase().trim()}</span>
          </div>
        </Link>
        {/* Logout button */}
        <LogoutButton />
      </nav>
    </header>
  );
}