import React from 'react';
import { Metadata } from 'next';
import RoadSearch from '@/components/RoadSearch';
import AlphabetNav from '@/components/AlphabetNav';
import HomeClient from '@/components/HomeClient';
import HomeMapWrapper from '@/components/HomeMapWrapper';
import Link from 'next/link';
import { fetchGroupedRoads } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
  description: 'Browse and search road construction projects across India. Track contractors, project status, and infrastructure development. Community-driven platform for road accountability.',
  openGraph: {
    title: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
    description: 'Community-driven platform tracking road construction projects across India. Know who built your road.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
    description: 'Community-driven platform tracking road construction projects across India.',
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: { letter?: string };
}) {

  const letter = searchParams.letter;
  const roadsData = await fetchGroupedRoads({
    skip: 0,
    limit: 20,
    sortBy: 'road_name',
    sortOrder: 'asc',
    letter,
  });

  const initialRoads = roadsData.data.roads;
  const initialTotal = roadsData.data.total;

  return (
    <div className="min-h-screen pt-24 pb-8 md:pt-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <div className="flex flex-col">
            <div className="mb-6 md:mb-8">
              <div className="mb-4">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">Road Projects</h1>
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  Know who&apos;s responsible for the roads you&apos;re riding on
                </p>
              </div>

              <RoadSearch className="w-full" />
            </div>

            <HomeClient initialRoads={initialRoads} initialTotal={initialTotal} letter={letter} />
          </div>

          {}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-3 overflow-y-auto max-h-[calc(100vh-7rem)] pr-2">
              <HomeMapWrapper letter={letter} />
              <AlphabetNav variant="desktop" />
              <div className="text-center text-xs text-gray-600 py-2">
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
                <span className="mx-2">•</span>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
