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
import HTESearchInput from "@/components/ui/student/HTESearchComponent";
import { Search, X } from 'lucide-react';

export default async function StudentDashboard({ searchParams }) {
  const params = await searchParams;
  const selectedHteId = params?.hte;
  const currentPage = parseInt(params?.page) || 1;
  const filter = params?.filter || 'all'; // 'all' or 'recommended'
  const searchQuery = params?.search || ''; // New search parameter
  const itemPerPage = 4; // Number of HTEs displayed per page

  // Get student profile for specializations
  const { student, error: studentError } = await getCurrentStudentProfile();
  
  // Fetch HTEs based on filter and search
  let hteData;
  if (filter === 'recommended' && student?.specializations) {
    hteData = await getRecommendedHTEs(student.specializations, currentPage, itemPerPage, searchQuery);
  } else {
    hteData = await getHTEs(currentPage, itemPerPage, searchQuery);
  }

  const { htes, error, totalCount, totalPages, hasNextPage, hasPreviousPage } = hteData;

  //Navigate to Fallback page for errors
  if (error || studentError) {
    errorFallback(
      error?.message || studentError?.message,
      "/",
      "Go back"
    );
  }

  // Function to create page URLs with filter and search
  const createPageUrl = (page) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (filter !== 'all') {
      params.set('filter', filter);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
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
        <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Host Training Establishments</h2>
          </div>
          
          <div className="flex flex-row justify-between">
            {/* HTE Filter Buttons */}
            <HTEFilterButtons 
              currentFilter={filter}
              hasSpecializations={!!(student?.specializations?.length)}
            />

            {/* Search Input */}
            <HTESearchInput currentSearch={searchQuery} />
          </div>
          
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing {htes?.length || 0} of {totalCount} HTEs
              {filter === 'recommended' && ' (recommended for you)'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
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
                <div className="mb-4">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                </div>
                <p className="text-gray-500 mb-2">
                  {searchQuery ? (
                    <>No HTEs found matching <strong>"{searchQuery}"</strong></>
                  ) : (
                    filter === 'recommended' 
                      ? student?.specializations?.length 
                        ? 'No HTEs match your specializations. Try viewing all HTEs.'
                        : 'Add specializations to your profile to see recommendations.'
                      : 'No HTEs found'
                  )}
                </p>
                {searchQuery && (
                  <p className="text-sm text-gray-400">
                    Try adjusting your search terms or browse all HTEs
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white">
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
                <div className="text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an HTE to view details</p>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-2">
                      Search results for "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}