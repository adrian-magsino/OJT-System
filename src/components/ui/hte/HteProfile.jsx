import { getHTEById } from "@/lib/services/hte-service";
import Image from "next/image"
import { MapPin, Mail, Contact, Link, User, Laptop, Building } from "lucide-react"

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
        <div className="flex flex-row items-center">
          <Building size={50}/>
          <h3 className="font-bold text-xl ml-3">{hte.name}</h3>
        </div>
      </div>

      <div className="flex gap-2">
        <MapPin /> 
        <div className="flex flex-col">
          {hte.location}
          <span className="text-gray-600 text-xs">Location</span>
        </div>
        
      </div>
      <div className="flex gap-2">
        <Laptop />
        <div className="flex flex-col">
          {hte.work_setup? (
            <p>{hte.work_setup.join(" | ")}</p>
          ):(
            <span className="text-gray-400 italic">Not provided</span>
          )}
          
          <span className="text-gray-600 text-xs">Work Setup</span>
        </div>
        
      </div>
      

      <div className="border-1 rounded-xl p-5 border-gray-200">
        <h3 className="font-bold text-md text-green-800">WORK TASKS</h3>
        <ul className="list-disc pl-4 pt-2">
          {hte.work_tasks?.length > 0 ? (
            hte.work_tasks.map((work_task) => (

              <li key={work_task}>{work_task}</li>
            ))
            ) : (
             <span className="text-gray-400 italic">Not provided</span>  
            )
          }
        </ul>
        
      </div>

      <div className="border-1 rounded-xl p-5 border-gray-200">
        <h3 className="font-bold text-md text-green-800">ABOUT THE COMPANY</h3>
        <div className="mt-2">
          <span className="text-gray-600 text-xs">Nature of work</span>
          <p>{hte.nature_of_work}</p>
        </div>
        <div className="mt-2">
          <span className="text-gray-600 text-xs">Description</span>
          <p>{hte.description}</p>
        </div>
        

        
      </div>

      <div className="border-1 rounded-xl p-5 border-gray-200">
        <h3 className="font-bold text-md text-green-800">CONTACTS</h3>
        <div className="flex gap-2 pt-4">
          <User /> 
          <div className="flex flex-col">
            {hte.person_in_charge} | {hte.designation}
            <span className="text-gray-600 text-xs">Person-in-charge</span>
          </div>
          
        </div>

        <div className="flex gap-2 pt-4">
          <Mail /> 
          <div className="flex flex-col">
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
            <span className="text-gray-600 text-xs">Email</span>
          </div>
          
          
        </div>
        <div className="flex gap-2 pt-4">
          <Contact /> 
          <div className="flex flex-col">
            {hte.contact_number}
            <span className="text-gray-600 text-xs">Contact Number</span>
          </div>
        </div>
          
        
      </div>
      <div className="border-1 rounded-xl p-5 border-gray-200">
        <h3 className="font-bold text-md text-green-800">LINKS</h3>
        <div className="flex gap-2 pt-4">
          {hte.links && hte.links.length > 0 ? (
            <div>
              {hte.links.map((link, index) => (
                <div key={index} className="flex flex-row gap-2">
                  <Link />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>

        
      </div>


    </div>
  );
}