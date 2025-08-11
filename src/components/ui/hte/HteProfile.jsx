import { getHTEById } from "@/lib/services/hte-service";
import Image from "next/image"
import { MapPin, Mail, Contact, Link } from "lucide-react"

export default async function HteProfile({ hte_id }) {

  const {hte, error} = await getHTEById(hte_id);

  if (error) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-red-500">Error loading HTE: {error.message}</p>
      </div>
    );
  }

  if (!hte) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-gray-500">No HTE data available</p>
      </div>
    );
  }


  return (
    // Remove unnecessary labels (location, hte_id, etc.) for final design 
    <div className="bg-white h-full flex flex-col gap-4 px-4 pt-6 pb-10 overflow-auto">
      <div>
        <p className="text-green-700 text-xs">HTE ID (FOR DEBUGGING ONLY): {hte.hte_id}</p>
        <div className="flex flex-row items-center">
          {/*Hte Profile Pic */}
          <div className="w-10 h-10 relative ">
            <Image 
              src="/sample_hte_pfp.png"
              fill 
              alt="Hte Profile Picture"
              className="object-cover border-1 border-black"
              sizes="80px"
            />
          </div>
          <h3 className="font-bold text-xl ml-4">{hte.name}</h3>
        </div>
      </div>

      <div className="flex gap-2"><MapPin /> {hte.location}</div>

      <div className="border-1 rounded-xl p-5">
        <h3 className="font-bold text-md text-green-800">WORK TASKS</h3>
        <ul className="list-disc pl-4 pt-2">
          {hte.work_tasks?.length > 0 ? (
            hte.work_tasks.map((work_task) => (

              <li key={work_task}>{work_task}</li>
            ))
            ) : (
              <p>Not provided</p>  
            )
          }
        </ul>
        
      </div>

      <div className="border-1 rounded-xl p-5">
        <h3 className="font-bold text-md text-green-800">ABOUT THE COMPANY</h3>
        <p className="mt-2">{hte.nature_of_work} <span className="text-green-700 text-xs"> Nature of Work (for debugging only)</span></p>
        <p className="mt-2">{hte.description} <span className="text-green-700 text-xs"> Description (for debugging only)</span></p>
      </div>

      <div className="border-1 rounded-xl p-5">
        <h3 className="font-bold text-md text-green-800">CONTACTS</h3>
        
        <div className="flex gap-2 pt-4">
          <Mail /> 
          {hte.email ? (
            <a
              href={`mailto:${hte.email}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {hte.email}
            </a>
          ) : (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>
        <div className="flex gap-2 pt-4">
          <Contact /> {hte.contact_number}</div>
        
      </div>
      <div className="border-1 rounded-xl p-5 ">
        <h3 className="font-bold text-md text-green-800">LINKS</h3>

        <div className="flex gap-2"><Link /> 
          <a 
            href={hte.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {hte.website}
          </a>
        </div>
      </div>


    </div>
  );
}