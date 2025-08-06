'use client'

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarProvider";

export default function Sidebar() {
  const { isCollapsed, setCollapsed, toggleSidebar, isMobile } = useSidebar();
  
  const linkClasses = `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
    isCollapsed && !isMobile ? 'justify-center' : ''
  }`;

  const handleMouseEnter = () => {
    if (!isMobile) {
      setCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setCollapsed(true);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-2 left-2 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-800/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed z-40 h-screen transition-all duration-300 ${
          isMobile 
            ? `w-64 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}` 
            : `${isCollapsed ? 'w-16' : 'w-64'}`
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-200 relative">
          {/* Close button for mobile */}
          {isMobile && !isCollapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="lg:hidden absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <ul className="space-y-2 font-medium">
            <li>
              <Link 
                href="/student" 
                className={linkClasses}
                title={isCollapsed && !isMobile ? 'Dashboard' : ''}
                onClick={handleLinkClick}
              >
                <Image src="/icons/panels-top-left.svg" width={20} height={20} alt="dashboard-icon"/>
                {(!isCollapsed || isMobile) && <span className="ms-3">DASHBOARD</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/student/forms" 
                className={linkClasses}
                title={isCollapsed && !isMobile ? 'Form 2' : ''}
                onClick={handleLinkClick}
              >
                <Image src="/icons/book-text.svg" width={20} height={20} alt="forms-icon"/>
                {(!isCollapsed || isMobile) && <span className="ms-3">FORM 2</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="#" 
                className={linkClasses}
                title={isCollapsed && !isMobile ? 'Page 3' : ''}
                onClick={handleLinkClick}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {(!isCollapsed || isMobile) && <span className="ms-3">PAGE 3</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}