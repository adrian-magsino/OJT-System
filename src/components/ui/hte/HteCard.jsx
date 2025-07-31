'use client'

import { parseParameter } from "next/dist/shared/lib/router/utils/route-regex";
import Image from "next/image";
import Link from "next/link"; 
import { usePathname, useSearchParams } from "next/navigation";

export default function HteCard({ hte_data, isSelected}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1'

  const createDesktopUrl = () => {
    const params = new URLSearchParams();
    params.set('page', currentPage);
    params.set('hte', hte_data.hte_id);
    return `${pathname}?${params.toString()}`;
  };

  const createMobileUrl = () => {
    const params = new URLSearchParams();
    params.set('from_page', currentPage);
    return `/student/hte/${hte_data.hte_id}?${params.toString()}`;
  }

  return (
    <>
      <Link
        href={createDesktopUrl()}
        className={`hidden lg:block flex flex-row border-2 w-full min-h-30 grow p-3 cursor-pointer transition-colors hover:bg-gray-50
          ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
      >
        <HteCardContent hte_data={hte_data} />
      </Link>

      {/* Navigation using mobile devices */}
      <Link
        href={createMobileUrl()}
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
        <h1 className="text-xl font-bold text-green-800">{hte_data.name}</h1>
        <p>{hte_data.location}</p>
        <p>{hte_data.nature_of_work}</p>
      </div>
      
    </div>
  );

}
  

