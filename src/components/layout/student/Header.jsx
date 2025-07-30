//STUDENT HEADER COMPONENT

"use client"

import Link from "next/link";
import { useState } from "react";
import LogoutButton from '@/components/auth/LogoutButton'

export default function StudentHeader({ user, error }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (error || !user) {
    return (
      <header className="w-full h-12 fixed bg-red-600 z-40">
        <nav className="mx-auto h-full flex items-center justify-center px-8">
          <div className="text-white font-medium">ERROR: UNABLE TO LOAD USER DATA</div>
          <LogoutButton />
        </nav>
      </header>
    );
  }

  const user_name = user.name;

  return (
    <header className="w-full h-12 fixed bg-green-700 z-40">
      <nav className="mx-auto h-full flex items-center justify-between px-8">
        {/* WEBSITE LOGO */}
        <div>
          <Link href="/" className="text-white font-bold">WEBSITE LOGO</Link>
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:bg-green-600 rounded-lg transition-colors"
          >
            <div className="flex flex-row items-center gap-3">
              <div data-component="avatar" className="bg-amber-300 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-semibold text-sm">{user_name.toUpperCase().trim()[0]}</span>
              </div>
              <span className="text-white font-medium">{user_name.toUpperCase().trim()}</span>
              {/* Dropdown arrow */}
              <svg 
                className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/student/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
}