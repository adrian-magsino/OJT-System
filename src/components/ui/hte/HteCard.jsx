'use client'

import Image from "next/image";
import Link from "next/link"; 
import { useSearchParams, usePathname } from "next/navigation";

export default function HteCard({ hteId, isSelected = false}) {
  const pathname = usePathname();

  const hte_data = {
    id: hteId,
    name: "Department of Information Technology",
    location: "Indang, Cavite"
  }

  // For large screens: update URL params
  // For small screens: navigate to dedicated page 
  const href = {
    pathname: pathname,
    query: { hte: hteId }
  }

  const mobileHref = `/student/hte/${hteId}`;

  return (
    <>
      <Link
        href={href}
        className={`hidden lg:block flex flex-row border-2 w-full min-h-30 grow p-3 cursor-pointer transition-colors hover:bg-gray-50
          ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
      >
        <HteCardContent hte_data={hte_data} />
      </Link>

      <Link
        href={mobileHref}
        className="block lg:hidden flex flex-row border-2 w-full min-h-30 grow p-3 cursor-pointer transition-colors hover:bg-gray-50 border-gray-200"
      >
          <HteCardContent hte_data={hte_data}/>
      </Link>
    </>
  )
}


function HteCardContent({ hte_data }) {
  return (
    <div className="flex">
      {/*HTE Image Container */}
      <div className="w-20 h-20 relative flex-shrink-0 mb-5">
        <Image 
          src="/sample_hte_pfp.png"
          fill 
          alt="Hte Profile Picture"
          className="object-cover border-2 border-black"
        />
      </div>

      {/*HTE details preview */}
      <div className="flex flex-col mx-10">
        <span className="text-xl font-bold text-green-800">{hte_data.name}</span>
        <span>{hte_data.location}</span>
        <span>Other details</span>
        <span>Other details</span>
      </div>
      
    </div>
  );

}
  

