import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RoadMap from '@/components/RoadMap';
import Breadcrumb from '@/components/Breadcrumb';
import RoadDetailClient from '@/components/RoadDetailClient';
import { fetchRoadBySlug, fetchRoadSegments } from '@/lib/api-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const roadSlug = decodeURIComponent(params.id);

  try {
    const roadData = await fetchRoadBySlug(roadSlug);
    const road = roadData.data.road;

    return {
      title: `${road.road_name}`,
      description: `Road construction project: ${road.road_name}. Contractor: ${road.contractor}. Status: ${road.status}. View detailed information about this infrastructure project in India.`,
      openGraph: {
        title: `${road.road_name} - Road Details`,
        description: `Contractor: ${road.contractor}. Status: ${road.status}. ${road.segment_count} segments.`,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${road.road_name} - Road Details`,
        description: `Contractor: ${road.contractor}. Status: ${road.status}.`,
      },
      alternates: {
        canonical: `https://whobuiltmyroad.com/roads/${roadSlug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Road Not Found',
      description: 'The requested road could not be found.',
    };
  }
}

export default async function RoadPage({ params }: PageProps) {
  const roadSlug = decodeURIComponent(params.id);

  let roadData;
  let segmentsData;

  try {
    [roadData, segmentsData] = await Promise.all([
      fetchRoadBySlug(roadSlug),
      fetchRoadSegments(roadSlug, { skip: 0, limit: 100 }),
    ]);
  } catch (error) {
    notFound();
  }

  const road = roadData.data.road;
  const geojson = segmentsData.data.geojson;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: road.road_name,
    description: `Road construction project in India`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen pt-24 pb-16 md:pt-28">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Roads', href: '/' }, { label: road.road_name }]} />

          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{road.road_name}</h1>
            <p className="text-sm md:text-base text-gray-600">
              {road.segment_count} segment{road.segment_count !== 1 ? 's' : ''}
            </p>
          </div>

          {}
          <div className="lg:hidden mb-6">
            {geojson && <RoadMap geojson={geojson} roadName={road.road_name} />}
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {}
            <div className="lg:col-span-3 space-y-6">
              <RoadDetailClient road={road} roadSlug={roadSlug} renderMode="left-column" />
            </div>

            {}
            <div className="lg:col-span-4 space-y-6">
              <RoadDetailClient road={road} roadSlug={roadSlug} renderMode="middle-column" />
            </div>

            {}
            <div className="lg:col-span-5 space-y-6">
              {}
              <div className="hidden lg:block">
                {geojson && <RoadMap geojson={geojson} roadName={road.road_name} />}
              </div>

              {}
              <div className="space-y-6">
                <RoadDetailClient road={road} roadSlug={roadSlug} renderMode="right-column" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
