'use client';

import React, { useState, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/lib/schemas';

interface PlaceSearchProps {
  onSelectPlace: (lat: number, lng: number, displayName: string) => void;
  initialValue?: string;
}

export default function PlaceSearch({ onSelectPlace, initialValue = '' }: PlaceSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { data, isLoading } = useSearch(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectPlace = (result: SearchResult) => {
    setQuery(result.display_name);
    setShowResults(false);
    onSelectPlace(result.lat, result.lon, result.display_name);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        placeholder="Search for a place..."
        className="input-field"
      />

      {showResults && debouncedQuery.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-gray-600">Searching...</div>
          ) : data?.data.results.length ? (
            <ul>
              {data.data.results.map((result, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectPlace(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="text-sm font-medium">{result.display_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.type} • {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-600">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

