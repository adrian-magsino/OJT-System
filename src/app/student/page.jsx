//STUDENT MAIN/HOME PAGE (DASHBOARD MAYBE?)

import HteCard from "@/components/ui/hte/HteCard";
import HteProfile from "@/components/ui/hte/HteProfile";
import { Suspense } from "react";


export default async function StudentDashboard({ searchParams }) {
  const params = await searchParams;
  const selectedHteId = params?.hte;

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
            <HteCard hteId={"1"} isSelected={selectedHteId === "1"}/>
            <HteCard hteId={"2"} isSelected={selectedHteId === "2"}/>
            <HteCard hteId={"3"} isSelected={selectedHteId === "3"}/>
            <HteCard hteId={"4"} isSelected={selectedHteId === "4"}/>
          </div>
        </div>
      </div>

      {/*Right Section */}
      <div className={`w-1/2 flex-col bg-gray-50 ${selectedHteId ? 'flex' : 'hidden lg:flex'}`}>
        <div className="h-full overflow-y-auto">
            {selectedHteId ? (
              <Suspense fallback={<div className="p-6">Loading HTE profile...</div>}>
                <HteProfile hteId={selectedHteId} />
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
