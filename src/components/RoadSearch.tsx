'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadSearch } from '@/hooks/useRoads';

interface RoadSearchProps {
  onSelect?: (roadName: string) => void;
  className?: string;
}

export default function RoadSearch({ onSelect, className = '' }: RoadSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useRoadSearch(query, 20);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (road: any) => {
    if (onSelect) {
      onSelect(road.road_name);
    } else {

      router.push(`/roads/${road.road_slug}`);
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search roads..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {showResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-600">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
            </div>
          ) : data && data.data.roads.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 border-b">
                Found {data.data.total} road{data.data.total !== 1 ? 's' : ''}
              </div>
              {data.data.roads.map((road) => (
                <button
                  key={road.road_name}
                  onClick={() => handleSelect(road)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{road.road_name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {road.segment_count} segment{road.segment_count !== 1 ? 's' : ''}
                        {road.has_osm_data && (
                          <span className="ml-2 text-green-600">• OSM Data</span>
                        )}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center text-gray-600 text-sm">
              No roads found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
