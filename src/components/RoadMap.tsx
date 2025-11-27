'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RoadMapProps {
  geojson: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][] | [number, number];
      };
      properties: {
        segment_slug: string;
        osm_way_id?: string;
      };
    }>;
  };
  roadName: string;
}

export default function RoadMap({ geojson, roadName }: RoadMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || !geojson || geojson.features.length === 0) return;

    let L: any;

    const initMap = async () => {

      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css' as any);

      if (!mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          touchZoom: true,
          dragging: true,
          tap: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }

      const map = mapInstanceRef.current;

      map.eachLayer((layer: any) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      const geoJsonLayer = L.geoJSON(geojson as any, {
        style: {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            const popupContent = `
              <div style="font-family: sans-serif;">
                <strong>${roadName}</strong><br>
                <a href="/roads/segment/${feature.properties.segment_slug}"
                   style="color: #3b82f6; text-decoration: none;">
                  View Segment →
                </a>
              </div>
            `;
            layer.bindPopup(popupContent);
          }
        },
      }).addTo(map);

      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geojson, roadName, isClient]);

  if (!geojson || geojson.features.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg md:text-xl font-bold mb-4">Map</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No map data available for this road</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      <h2 className="text-lg md:text-xl font-bold mb-4">Map</h2>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden bg-gray-100"
        style={{ height: '400px', minHeight: '400px', zIndex: 0 }}
      />
    </div>
  );
}
