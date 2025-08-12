'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Search Input Component
export default function HTESearchInput({ currentSearch }) {
  const [searchValue, setSearchValue] = useState(currentSearch || '');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== currentSearch) {
        handleSearch(searchValue);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, currentSearch]);

  const handleSearch = (query) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    
    // Reset to first page when searching
    params.set('page', '1');
    
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    
    // Remove selected HTE when searching
    params.delete('hte');
    
    router.push(`${pathname}?${params.toString()}`);
    
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 300);
  };

  const clearSearch = () => {
    setSearchValue('');
    handleSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors ${
            isSearching ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type="text"
          placeholder="Search companies by name, location, or nature of work..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Search indicator */}
      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1">
          <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded border border-blue-200">
            Searching...
          </div>
        </div>
      )}
    </div>
  );
}

