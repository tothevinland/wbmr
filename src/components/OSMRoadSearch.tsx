'use client';

import React, { useState, useEffect } from 'react';
import { useSearchOSMRoads } from '@/hooks/useOSM';

interface OSMRoad {
  osm_way_id: string;
  name: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  tags: Record<string, string>;
  has_our_data: boolean;
}

interface OSMRoadSearchProps {
  onSelectRoad: (road: OSMRoad) => void;
  initialQuery?: string;
  centerLat?: number;
  centerLng?: number;
}

export default function OSMRoadSearch({
  onSelectRoad,
  initialQuery = '',
  centerLat = 20.5937,
  centerLng = 78.9629,
}: OSMRoadSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { data, isLoading } = useSearchOSMRoads(debouncedQuery, centerLat, centerLng, 10000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectRoad = (road: OSMRoad) => {
    setQuery(road.name);
    setShowResults(false);
    onSelectRoad(road);
  };

  return (
    <div className="relative w-full">
      <div>
        <label className="block text-sm font-medium mb-2">
          Search OpenStreetMap Road
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search for road name (e.g., MG Road, NH 44)..."
          className="input-field"
        />
        <p className="text-xs text-gray-600 mt-1">
          Search for actual roads from OpenStreetMap to link construction data
        </p>
      </div>

      {showResults && debouncedQuery.length >= 2 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-gray-600">Searching OpenStreetMap...</div>
          ) : data?.data?.results?.length ? (
            <ul>
              {data.data.results.map((road: OSMRoad) => (
                <li
                  key={road.osm_way_id}
                  onClick={() => handleSelectRoad(road)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{road.name}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Type:</span> {road.tags.highway || 'road'}
                        </div>
                        {road.tags.surface && (
                          <div>
                            <span className="font-medium">Surface:</span> {road.tags.surface}
                          </div>
                        )}
                        {road.tags.lanes && (
                          <div>
                            <span className="font-medium">Lanes:</span> {road.tags.lanes}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          OSM ID: {road.osm_way_id}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {road.has_our_data ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Has Data
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          No Data
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-600">
              No roads found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

