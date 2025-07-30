//STUDENT MAIN/HOME PAGE (DASHBOARD MAYBE?)

import HteCard from "@/components/ui/hte/HteCard";
import HteProfile from "@/components/ui/hte/HteProfile";
import { getAllHTEs } from "@/lib/services/hte-service";
import { Suspense } from "react";


export default async function StudentDashboard({ searchParams }) {
  const params = await searchParams;
  const selectedHteId = params?.hte;

  //Fetch all HTEs (temporary approach, improve later)
  const { htes, error } = await getAllHTEs();

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error loading HTEs: {error.message}</p> 
      </div>
    )
  }

  const selectedHte = htes?.find(hte => hte.hte_id === selectedHteId);

  return (
    <div className="h-[calc(100vh-3rem)] flex">

      {/*Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200">

        {/*Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Host Training Establishments</h2>
          <p className="text-sm text-gray-600 mt-1">Select an HTE to view details</p>
        </div>

        {/*List of HTEs */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {htes?.map((hte) => (
              <HteCard 
                key={hte.hte_id}
                hte_data={hte}
                isSelected={selectedHteId === hte.hte_id}
              />
            ))}
          </div>
        </div>
      </div>

      {/*Right Section */}
      <div className={`w-1/2 flex-col bg-gray-50 ${selectedHteId ? 'flex' : 'hidden lg:flex'}`}>
        <div className="h-full overflow-y-auto">
            {selectedHteId ? (
              <Suspense fallback={<div className="p-6">Loading HTE profile...</div>}>
                <HteProfile hte_id={selectedHteId} />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p>Select an HTE to view details</p>
              </div>
            )}
          </div>
        
      </div>
    </div>
  );
}
