'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HomeMapProps {
  roads: Array<{
    road_name: string;
    road_slug: string;
    sample_location: {
      lat: number;
      lng: number;
    };
    segment_count: number;
    sample_status: string;
  }>;
}

export default function HomeMap({ roads }: HomeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      setLeafletReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || roads.length === 0 || !leafletReady || !L) return;

    const initMap = async () => {
      if (!mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [20.5937, 78.9629],
          zoom: 5,
          zoomControl: true,
          scrollWheelZoom: true,
          touchZoom: true,
          dragging: true,
          tap: true,
          preferCanvas: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }

      const map = mapInstanceRef.current;

      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const bounds: any[] = [];
      roads.forEach((road) => {
        const marker = L.marker(
          [road.sample_location.lat, road.sample_location.lng],
          { icon: customIcon }
        ).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif;">
            <strong>${road.road_name}</strong><br>
            <span style="font-size: 12px; color: #666;">
              ${road.segment_count} segment${road.segment_count > 1 ? 's' : ''} • ${road.sample_status}
            </span><br>
            <a href="/roads/${road.road_slug}"
               style="color: #3b82f6; text-decoration: none; font-size: 12px;">
              View Details →
            </a>
          </div>
        `);

        bounds.push([road.sample_location.lat, road.sample_location.lng]);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [roads, isClient, leafletReady, L]);

  if (!isClient || roads.length === 0) {
    return null;
  }

  if (!leafletReady) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm h-full">
        <h2 className="text-lg md:text-xl font-bold mb-4">All Roads</h2>
        <div
          className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
      <h2 className="text-lg md:text-xl font-bold mb-4">All Roads</h2>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden bg-gray-100"
        style={{ height: 'calc(100% - 48px)', minHeight: '400px', zIndex: 0 }}
      />
    </div>
  );
}
