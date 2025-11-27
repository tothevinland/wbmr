'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMainRoad, useInfiniteRoadSegments, useRoadFeedback, useAddFeedback, useUpdateMainRoad, useDeleteImage, useDeleteFeedback } from '@/hooks/useRoads';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import RoadMap from '@/components/RoadMap';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PeopleInvolvedInput from '@/components/ui/PeopleInvolvedInput';
import StatusSelect from '@/components/ui/StatusSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema, FeedbackInput } from '@/lib/schemas';

export default function RoadPage() {
  const params = useParams();
  const router = useRouter();
  const roadSlug = decodeURIComponent(params.id as string);
  const { isAuthenticated, user } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPeople, setIsEditingPeople] = useState(false);
  const [editedRoad, setEditedRoad] = useState<any>(null);
  const [editedPeople, setEditedPeople] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'image' | 'feedback'; id: string } | null>(null);

  const { data: roadData, isLoading: roadLoading, error: roadError } = useMainRoad(roadSlug);

  const {
    data: segmentsData,
    isLoading: segmentsLoading,
    error: segmentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRoadSegments(roadSlug);

  const { data: feedbackData, isLoading: feedbackLoading, refetch: refetchFeedback } = useRoadFeedback(roadSlug, 0, 50);

  const addFeedback = useAddFeedback(roadSlug);
  const updateMainRoad = useUpdateMainRoad(roadSlug);
  const deleteImage = useDeleteImage(roadSlug);
  const deleteFeedback = useDeleteFeedback(roadSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmitFeedback = (data: FeedbackInput) => {
    addFeedback.mutate(data, {
      onSuccess: () => {
        reset();
        setShowFeedbackForm(false);
        refetchFeedback();
      },
      onError: (error: any) => {
        console.error('Failed to add feedback:', error);
      },
    });
  };

  if (roadLoading || segmentsLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
        <Loading text="Loading road details..." />
      </div>
    );
  }

  if (roadError || segmentsError || !roadData || !segmentsData) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
        <ErrorMessage message="Failed to load road details" />
      </div>
    );
  }

  const road = roadData.data.road;
  const geojson = roadData.data.geojson;
  const allSegments = segmentsData.pages.flatMap(page => page.data.geojson.features);
  const totalSegments = segmentsData.pages[0]?.data.pagination.total || 0;
  const feedback = feedbackData?.data.feedback || [];

  const getImageUrl = (image: string | { url: string; uploaded_by: string; uploaded_at: string }): string => {
    return typeof image === 'string' ? image : image.url;
  };

  const getImageMetadata = (image: string | { url: string; uploaded_by: string; uploaded_at: string }) => {
    return typeof image === 'string' ? null : { uploaded_by: image.uploaded_by, uploaded_at: image.uploaded_at };
  };

  const canDeleteImage = (image: string | { url: string; uploaded_by: string; uploaded_at: string }, currentUsername?: string) => {
    if (!currentUsername) return false;

    if (typeof image === 'string') {

      return road.added_by_user === currentUsername;
    } else {

      return image.uploaded_by === currentUsername;
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(getImageUrl(road.images[index]));
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % road.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(getImageUrl(road.images[nextIndex]));
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + road.images.length) % road.images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(getImageUrl(road.images[prevIndex]));
  };

  const handleDeleteImage = (imageUrl: string) => {
    setDeleteConfirm({ type: 'image', id: imageUrl });
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setDeleteConfirm({ type: 'feedback', id: feedbackId });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'image') {
      deleteImage.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      });
    } else if (deleteConfirm.type === 'feedback') {
      deleteFeedback.mutate(deleteConfirm.id, {
        onSuccess: () => setDeleteConfirm(null),
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowAllImages(false);
  };

  const handleEditClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setEditedRoad({
      contractor: road.contractor,
      approved_by: road.approved_by,
      total_cost: road.total_cost,
      promised_completion_date: road.promised_completion_date,
      actual_completion_date: road.actual_completion_date,
      maintenance_firm: road.maintenance_firm,
      status: road.status,
      type: road.type || '',
      people_involved: road.people_involved || [],
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRoad(null);
  };

  const handleSaveEdit = () => {
    if (editedRoad) {
      updateMainRoad.mutate(editedRoad, {
        onSuccess: () => {
          setIsEditing(false);
          setEditedRoad(null);
        },
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedRoad((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditPeopleClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setEditedPeople(road.people_involved || []);
    setIsEditingPeople(true);
  };

  const handleCancelPeopleEdit = () => {
    setIsEditingPeople(false);
    setEditedPeople([]);
  };

  const handleSavePeopleEdit = () => {
    updateMainRoad.mutate({ people_involved: editedPeople }, {
      onSuccess: () => {
        setIsEditingPeople(false);
        setEditedPeople([]);
      },
    });
  };

  return (
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {}
          <div className="lg:col-span-3 space-y-6">
            {}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">Road Details</h2>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <StatusSelect
                    label="Status"
                    value={editedRoad.status}
                    onChange={(value) => handleFieldChange('status', value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Status</h3>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm">
                      {road.status}
                    </span>
                  </div>
                )}

                {isEditing && (
                  <Input
                    label="Road Type"
                    value={editedRoad.type || ''}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    placeholder="e.g., trunk, primary, motorway (optional)"
                  />
                )}

                {!isEditing && road.type && (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Road Type</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      {road.type}
                    </span>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Contractor"
                    value={editedRoad.contractor}
                    onChange={(e) => handleFieldChange('contractor', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Contractor</h3>
                    <p className="text-base">{road.contractor}</p>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Approved By"
                    value={editedRoad.approved_by}
                    onChange={(e) => handleFieldChange('approved_by', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Approved By</h3>
                    <p className="text-base">{road.approved_by}</p>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Total Cost"
                    type="number"
                    step="0.01"
                    value={editedRoad.total_cost}
                    onChange={(e) => handleFieldChange('total_cost', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Total Cost</h3>
                    <p className="text-base font-bold">{road.total_cost ? `₹${Number(road.total_cost).toLocaleString('en-IN')}` : 'N/A'}</p>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Maintenance Firm"
                    value={editedRoad.maintenance_firm}
                    onChange={(e) => handleFieldChange('maintenance_firm', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Maintenance Firm</h3>
                    <p className="text-base">{road.maintenance_firm}</p>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Promised Completion"
                    type="date"
                    value={editedRoad.promised_completion_date}
                    onChange={(e) => handleFieldChange('promised_completion_date', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Promised Completion</h3>
                    <p className="text-base">{road.promised_completion_date || 'N/A'}</p>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Actual Completion"
                    type="date"
                    value={editedRoad.actual_completion_date || ''}
                    onChange={(e) => handleFieldChange('actual_completion_date', e.target.value)}
                  />
                ) : (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Actual Completion</h3>
                    <p className="text-base">{road.actual_completion_date || 'N/A'}</p>
                  </div>
                )}
              </div>

              {}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button
                    onClick={handleSaveEdit}
                    isLoading={updateMainRoad.isPending}
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
            <div className="lg:hidden bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">People Involved</h2>
                {!isEditingPeople && (
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
                      isLoading={updateMainRoad.isPending}
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
              ) : road.people_involved && road.people_involved.length > 0 ? (
                <div className="space-y-4">
                  {road.people_involved.map((person: any, idx: number) => (
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
                <p className="text-gray-600 text-center py-4">No people involved information available</p>
              )}
            </div>

            {}
            {road.images && road.images.length > 0 && (
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold">Images ({road.images.length})</h2>
                  {road.images.length > 1 && (
                    <button
                      onClick={() => setShowAllImages(true)}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      View All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {road.images.slice(0, 1).map((image, idx) => {
                    const imageUrl = getImageUrl(image);
                    const metadata = getImageMetadata(image);
                    const canDelete = canDeleteImage(image, user?.username);

                    return (
                      <div key={idx} className="relative">
                        <div
                          className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(idx)}
                        >
                          <img
                            src={imageUrl}
                            alt={`${road.road_name} - ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {metadata && (
                          <p className="text-xs text-gray-600 mt-1">
                            By {metadata.uploaded_by}
                          </p>
                        )}
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(imageUrl);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {road.images.length > 1 && (() => {
                    const image = road.images[1];
                    const imageUrl = getImageUrl(image);
                    const metadata = getImageMetadata(image);
                    const canDelete = canDeleteImage(image, user?.username);

                    return (
                      <div key={1} className="hidden md:block relative">
                        <div
                          className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(1)}
                        >
                          <img
                            src={imageUrl}
                            alt={`${road.road_name} - 2`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {metadata && (
                          <p className="text-xs text-gray-600 mt-1">
                            By {metadata.uploaded_by}
                          </p>
                        )}
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(imageUrl);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {}
            {isAuthenticated && (
              <div className="space-y-3">
                <Link href={`/roads/${roadSlug}/upload`}>
                  <Button variant="secondary">Upload Image</Button>
                </Link>
              </div>
            )}

            {}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">
                  Feedback ({feedback.length})
                </h2>
                {isAuthenticated && (
                  <Button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    variant="accent"
                    className="text-sm"
                  >
                    {showFeedbackForm ? 'Cancel' : 'Add'}
                  </Button>
                )}
              </div>

              {showFeedbackForm && (
                <form onSubmit={handleSubmit(onSubmitFeedback)} className="mb-4">
                  <Textarea
                    label="Your Feedback"
                    placeholder="Share your thoughts about this road..."
                    rows={4}
                    error={errors.comment?.message}
                    {...register('comment')}
                  />
                  <div className="mt-3">
                    <Button
                      type="submit"
                      isLoading={addFeedback.isPending}
                      variant="primary"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              )}

              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                      Login
                    </Link>{' '}
                    to add feedback
                  </p>
                </div>
              )}

              {feedbackLoading ? (
                <Loading text="Loading feedback..." />
              ) : feedback.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">
                  No feedback yet. Be the first!
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{item.user}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            {new Date(item.date.iso).toLocaleDateString()}
                          </span>
                          {user?.username === item.user && (
                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="text-red-500 hover:text-red-600 text-xs font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{item.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {}
          <div className="lg:col-span-2 space-y-6">
            {}
            <div className="hidden lg:block">
              {geojson && <RoadMap geojson={geojson} roadName={road.road_name} />}
            </div>

            {}
            <div className="hidden lg:block bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">People Involved</h2>
                {!isEditingPeople && (
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
                      isLoading={updateMainRoad.isPending}
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
              ) : road.people_involved && road.people_involved.length > 0 ? (
                <div className="space-y-4">
                  {road.people_involved.map((person: any, idx: number) => (
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
                <p className="text-gray-600 text-center py-4">No people involved information available</p>
              )}
            </div>

            {}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Segments ({allSegments.length})
              </h2>

              {allSegments.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No segments found</p>
              ) : (
                <div className="space-y-2">
                  {allSegments.map((segment: any) => {
                    const props = segment.properties;

                    return (
                      <div
                        key={props.segment_slug}
                        onClick={() => router.push(`/roads/segment/${props.segment_slug}`)}
                        className="bg-gray-50 px-3 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">
                            {props.segment_id}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-white rounded text-gray-600 whitespace-nowrap">
                            {props.status}
                          </span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    );
                  })}

                  {hasNextPage && (
                    <div className="pt-3 flex justify-center">
                      <Button
                        onClick={() => fetchNextPage()}
                        variant="secondary"
                        isLoading={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? 'Loading...' : 'Load More'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            {}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
              onClick={handleCloseModal}
            >
              ×
            </button>

            {}
            <div className="absolute top-4 left-4 text-white text-sm font-medium z-10">
              {currentImageIndex + 1} / {road.images.length}
            </div>

            {}
            {road.images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-5xl font-bold z-10 p-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
              >
                ‹
              </button>
            )}

            {}
            <img
              src={selectedImage}
              alt={road.road_name}
              className="max-w-[90%] max-h-[90%] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {}
            {road.images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-5xl font-bold z-10 p-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
              >
                ›
              </button>
            )}
          </div>
        )}

        {}
        {showAllImages && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <div className="min-h-screen p-4 md:p-8">
              {}
              <button
                className="fixed top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
                onClick={handleCloseModal}
              >
                ×
              </button>

              {}
              <h2 className="text-white text-2xl font-bold mb-6 text-center pt-4">
                All Images ({road.images.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto" onClick={(e) => e.stopPropagation()}>
                {road.images.map((image, idx) => {
                  const imageUrl = getImageUrl(image);
                  const metadata = getImageMetadata(image);
                  const canDelete = canDeleteImage(image, user?.username);

                  return (
                    <div key={idx} className="relative">
                      <div
                        className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setShowAllImages(false);
                          handleImageClick(idx);
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${road.road_name} - ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {idx + 1}
                        </div>
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(imageUrl);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      {metadata && (
                        <p className="text-white text-xs mt-2">
                          By {metadata.uploaded_by} · {new Date(metadata.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {}
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title={deleteConfirm?.type === 'image' ? 'Delete Image' : 'Delete Feedback'}
          message={
            deleteConfirm?.type === 'image'
              ? 'Are you sure you want to delete this image? This action cannot be undone.'
              : 'Are you sure you want to delete this feedback? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleteImage.isPending || deleteFeedback.isPending}
        />
      </div>
    </div>
  );
}
