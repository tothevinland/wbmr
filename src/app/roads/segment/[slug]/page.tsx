'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoadSegment, useUpdateSegment } from '@/hooks/useRoads';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import StatusSelect from '@/components/ui/StatusSelect';
import PeopleInvolvedInput from '@/components/ui/PeopleInvolvedInput';
import SegmentHistory from '@/components/SegmentHistory';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export default function SegmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const segmentSlug = decodeURIComponent(params.slug as string);
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSegment, setEditedSegment] = useState<any>(null);
  const [isEditingPeople, setIsEditingPeople] = useState(false);
  const [editedPeople, setEditedPeople] = useState<any[]>([]);

  const { data: segmentData, isLoading: segmentLoading, error: segmentError } = useRoadSegment(segmentSlug);
  const updateSegment = useUpdateSegment(segmentSlug);

  if (segmentLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
        <Loading text="Loading segment details..." />
      </div>
    );
  }

  if (segmentError || !segmentData) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
        <ErrorMessage message="Failed to load segment details" />
      </div>
    );
  }

  const { segment, geojson } = segmentData.data;
  if (!geojson || !segment) return null;

  const coords = geojson.geometry.coordinates;
  const location = geojson.geometry.type === 'Point'
    ? { lng: coords[0], lat: coords[1] }
    : { lng: coords[0][0], lat: coords[0][1] };

  const handleEditClick = () => {
    setEditedSegment({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedSegment(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    updateSegment.mutate(editedSegment, {
      onSuccess: () => {
        setIsEditing(false);
        setEditedSegment(null);
        router.refresh();
      },
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedSegment((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditPeopleClick = () => {
    setEditedPeople(segment.people_involved || []);
    setIsEditingPeople(true);
  };

  const handleCancelPeopleEdit = () => {
    setEditedPeople([]);
    setIsEditingPeople(false);
  };

  const handleSavePeopleEdit = () => {
    updateSegment.mutate({ people_involved: editedPeople }, {
      onSuccess: () => {
        setIsEditingPeople(false);
        setEditedPeople([]);
        router.refresh();
      },
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 md:pt-28">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Roads', href: '/' },
          { label: segment.road_name, href: `/roads/${segment.road_slug}` },
          { label: segment.segment_id || 'Segment' }
        ]} />

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{segment.road_name}</h1>
          <p className="text-sm md:text-base text-gray-600">
            Segment: <strong>{segment.segment_id || 'N/A'}</strong>
          </p>
        </div>

        <SegmentHistory segmentSlug={segmentSlug} />

        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Segment Details</h2>
            {!isEditing && isAuthenticated && (
              <button
                onClick={handleEditClick}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Segment ID</h3>
              <p className="text-base md:text-lg font-bold">{segment.segment_id || 'N/A'}</p>
            </div>

            {isEditing ? (
              <StatusSelect
                label="Status"
                value={editedSegment.status !== undefined ? editedSegment.status : segment.status}
                onChange={(value) => handleFieldChange('status', value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Status</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm md:text-base">
                  {segment.status}
                </span>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Contractor"
                value={editedSegment.contractor !== undefined ? editedSegment.contractor : segment.contractor}
                onChange={(e) => handleFieldChange('contractor', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Contractor</h3>
                <p className="text-base md:text-lg">{segment.contractor}</p>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Approved By"
                value={editedSegment.approved_by !== undefined ? editedSegment.approved_by : segment.approved_by}
                onChange={(e) => handleFieldChange('approved_by', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Approved By</h3>
                <p className="text-base md:text-lg">{segment.approved_by}</p>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Total Cost"
                type="number"
                value={editedSegment.total_cost !== undefined ? editedSegment.total_cost : segment.total_cost}
                onChange={(e) => handleFieldChange('total_cost', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Total Cost</h3>
                <p className="text-base md:text-lg font-bold">{segment.total_cost ? `₹${Number(segment.total_cost).toLocaleString('en-IN')}` : 'N/A'}</p>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Maintenance Firm"
                value={editedSegment.maintenance_firm !== undefined ? editedSegment.maintenance_firm : segment.maintenance_firm}
                onChange={(e) => handleFieldChange('maintenance_firm', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Maintenance Firm</h3>
                <p className="text-base md:text-lg">{segment.maintenance_firm}</p>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Promised Completion"
                type="date"
                value={editedSegment.promised_completion_date !== undefined ? editedSegment.promised_completion_date : segment.promised_completion_date}
                onChange={(e) => handleFieldChange('promised_completion_date', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Promised Completion</h3>
                <p className="text-base md:text-lg">{segment.promised_completion_date ? new Date(segment.promised_completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
              </div>
            )}

            {isEditing ? (
              <Input
                label="Actual Completion"
                type="date"
                value={editedSegment.actual_completion_date !== undefined ? editedSegment.actual_completion_date : segment.actual_completion_date}
                onChange={(e) => handleFieldChange('actual_completion_date', e.target.value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Actual Completion</h3>
                <p className="text-base md:text-lg">{segment.actual_completion_date ? new Date(segment.actual_completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
              </div>
            )}

            {segment.has_osm_data && segment.osm_way_id && (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">OSM Way ID</h3>
                <a
                  href={`https://www.openstreetmap.org/way/${segment.osm_way_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-blue-600 hover:underline"
                >
                  {segment.osm_way_id}
                </a>
              </div>
            )}

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Location</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=17`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm text-blue-600 hover:underline"
              >
                View on OpenStreetMap →
              </a>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Road</h3>
              <Link
                href={`/roads/${segment.road_slug}`}
                className="text-base md:text-lg text-blue-600 hover:underline"
              >
                {segment.road_name} →
              </Link>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button
                onClick={handleSaveEdit}
                isLoading={updateSegment.isPending}
                variant="primary"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">People Involved</h2>
            {!isEditingPeople && isAuthenticated && (
              <button
                onClick={handleEditPeopleClick}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Edit
              </button>
            )}
          </div>
          {isEditingPeople ? (
            <>
              <PeopleInvolvedInput
                people={editedPeople}
                onChange={setEditedPeople}
              />
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button
                  onClick={handleSavePeopleEdit}
                  isLoading={updateSegment.isPending}
                  variant="primary"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancelPeopleEdit}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : segment.people_involved && segment.people_involved.length > 0 ? (
            <div className="space-y-4">
              {segment.people_involved.map((person: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {person.image && (
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{person.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{person.role}</p>
                    {person.organization && (
                      <p className="text-sm text-gray-600 mt-1">{person.organization}</p>
                    )}
                    {person.contact && (
                      <p className="text-sm text-gray-500 mt-1">{person.contact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No people involved added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
