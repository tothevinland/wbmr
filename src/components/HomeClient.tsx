'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteGroupedRoads } from '@/hooks/useRoads';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import AlphabetNav from '@/components/AlphabetNav';
import HomeMap from '@/components/HomeMap';

interface HomeClientProps {
  initialRoads: any[];
  initialTotal: number;
  letter?: string;
}

export default function HomeClient({ initialRoads, initialTotal, letter }: HomeClientProps) {
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupedRoads(20, {
    sortBy: 'road_name',
    sortOrder: 'asc',
    letter,
  });

  const allRoads = data?.pages.flatMap((page: any) => page.data.roads) || initialRoads;
  const total = data?.pages[0]?.data.total || initialTotal;

  return (
    <>
      <div className="lg:hidden mb-6">
        <HomeMap roads={allRoads} />
      </div>

      <div className="mb-6 md:mb-8">
        <div className="mb-4">
          <p className="text-sm md:text-base text-gray-600">
            {total} roads listed
            {letter && (
              <span className="ml-2 text-blue-600 font-semibold">
                (filtered by letter: {letter})
              </span>
            )}
          </p>
        </div>
      </div>

      {allRoads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No roads found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {allRoads.map((road: any) => (
              <div
                key={road.road_name}
                onClick={() => router.push(`/roads/${road.road_slug}`)}
                className="bg-white p-4 md:p-5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">
                      {road.road_name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span>{road.sample_contractor}</span>
                      <span>•</span>
                      <span>{road.sample_status}</span>
                      {road.sample_type && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">{road.sample_type}</span>
                        </>
                      )}
                      {road.segment_count > 1 && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{road.segment_count} segments</span>
                        </>
                      )}
                      {road.has_osm_data && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">OSM Data</span>
                        </>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                variant="secondary"
                isLoading={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          <div className="lg:hidden mt-6 space-y-4">
            <AlphabetNav variant="mobile" />
            <div className="text-center text-xs text-gray-600 py-2">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <span className="mx-2">•</span>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
