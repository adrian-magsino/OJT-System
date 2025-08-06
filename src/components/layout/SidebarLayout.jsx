'use client'

import { useSidebar } from "@/contexts/SidebarProvider";

export default function SidebarLayout({ children }) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <main className={`transition-all duration-300 ${
      isMobile 
        ? 'ml-0' // No margin on mobile, sidebar overlays
        : isCollapsed ? 'ml-16' : 'ml-64' // Desktop behavior
    }`}>
      {children}
    </main>
  );
}