'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function HTEFilterButtons({ currentFilter, hasSpecializations }) {
  const searchParams = useSearchParams();
  
  // Create filter URLs on the client side
  const createFilterUrl = (newFilter) => {
    const params = new URLSearchParams();
    params.set('page', '1'); // Reset to first page when changing filter
    if (newFilter !== 'all') {
      params.set('filter', newFilter);
    }
    // Don't preserve selected HTE when changing filter
    return `/student?${params.toString()}`;
  };

  return (
    <div className="flex items-center">
      <Link 
        href={createFilterUrl('all')}
        className={`px-4 py-1 border border-gray-200 rounded-l-xl transition-colors ${
          currentFilter === 'all' 
            ? 'bg-green-600 text-white' 
            : 'hover:bg-green-600 hover:text-white'
        }`}
      >
        <span className="text-sm">All</span>
      </Link>
      
      <Link 
        href={createFilterUrl('recommended')}
        className={`px-4 py-1 border border-gray-200 rounded-r-xl transition-colors relative ${
          currentFilter === 'recommended' 
            ? 'bg-green-600 text-white' 
            : 'hover:bg-green-600 hover:text-white'
        } ${!hasSpecializations ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={!hasSpecializations ? (e) => e.preventDefault() : undefined}
        title={!hasSpecializations ? 'Add specializations to your profile to see recommendations' : ''}
      >
        <span className="text-sm">Recommended</span>
        {!hasSpecializations && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
        )}
      </Link>
    </div>
  );
}