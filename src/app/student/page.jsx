//STUDENT MAIN/HOME PAGE (DASHBOARD MAYBE?)

import HteCard from "@/components/ui/hte/HteCard";
import HteProfile from "@/components/ui/hte/HteProfile";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { getHTEs, getRecommendedHTEs } from "@/lib/services/hte-service";
import { getCurrentStudentProfile } from "@/lib/services/student-service";
import { errorFallback } from "@/lib/utils/error/error-handler";
import { Suspense } from "react";
import HTEFilterButtons from "@/components/ui/student/HTEFilterButtons";

export default async function StudentDashboard({ searchParams }) {
  const params = await searchParams;
  const selectedHteId = params?.hte;
  const currentPage = parseInt(params?.page) || 1;
  const filter = params?.filter || 'all'; // 'all' or 'recommended'
  const itemPerPage = 4; // Number of HTEs displayed per page

  // Get student profile for specializations
  const { student, error: studentError } = await getCurrentStudentProfile();
  
  // Fetch HTEs based on filter
  let hteData;
  if (filter === 'recommended' && student?.specializations) {
    hteData = await getRecommendedHTEs(student.specializations, currentPage, itemPerPage);
  } else {
    hteData = await getHTEs(currentPage, itemPerPage);
  }

  const { htes, error, totalCount, totalPages, hasNextPage, hasPreviousPage } = hteData;

  if (error || studentError) {
    errorFallback(
      error?.message || studentError?.message,
      "/",
      "Go back"
    );
  }

  // Function to create page URLs with filter
  const createPageUrl = (page) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (filter !== 'all') {
      params.set('filter', filter);
    }
    if (selectedHteId) {
      params.set('hte', selectedHteId);
    }
    return `/student?${params.toString()}`;
  };

  return (
    <div className="h-[calc(100vh-3rem)] flex">
      {/*Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200">

        {/*Fixed Header */}
        <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Host Training Establishments</h2>
          
          {/* HTE Filter Buttons */}
          <HTEFilterButtons 
            currentFilter={filter}
            hasSpecializations={!!(student?.specializations?.length)}
          />
          
          <p className="text-sm text-gray-600 mt-2 ml-5">
            Showing {htes?.length || 0} of {totalCount} HTEs
            {filter === 'recommended' && ' (recommended for you)'}
          </p>
        </div>

        {/*List of HTEs */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {htes?.length > 0 ? (
              htes?.map((hte) => (
                <HteCard 
                  key={hte.hte_id}
                  hte_data={hte}
                  isSelected={selectedHteId === hte.hte_id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {filter === 'recommended' 
                    ? student?.specializations?.length 
                      ? 'No HTEs match your specializations. Try viewing all HTEs.'
                      : 'Add specializations to your profile to see recommendations.'
                    : 'No HTEs found'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            createPageUrl={createPageUrl}
          />
        </div>
      </div>

      {/*Right Section */}
      <div className={`w-1/2 flex-col bg-gray-50 ${selectedHteId ? 'flex' : 'hidden lg:flex'}`}>
        <div className="h-full">
            {selectedHteId ? (
              <Suspense fallback={<div className="p-6"><SkeletonLoader /></div>}>
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