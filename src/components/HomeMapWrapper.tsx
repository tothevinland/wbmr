'use client';

import React, { Suspense } from 'react';
import { useInfiniteGroupedRoads } from '@/hooks/useRoads';
import HomeMap from '@/components/HomeMap';

interface HomeMapWrapperProps {
  letter?: string;
}

function MapLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
      <h2 className="text-lg md:text-xl font-bold mb-4">All Roads</h2>
      <div
        className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center animate-pulse"
        style={{ height: 'calc(100% - 48px)', minHeight: '400px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeMapWrapper({ letter }: HomeMapWrapperProps) {
  const {
    data,
    isLoading,
  } = useInfiniteGroupedRoads(20, {
    sortBy: 'road_name',
    sortOrder: 'asc',
    letter,
  });

  const allRoads = data?.pages.flatMap((page: any) => page.data.roads) || [];

  if (isLoading) {
    return <MapLoadingSkeleton />;
  }

  if (allRoads.length === 0) {
    return null;
  }

  return (
    <Suspense fallback={<MapLoadingSkeleton />}>
      <HomeMap roads={allRoads} />
    </Suspense>
  );
}
