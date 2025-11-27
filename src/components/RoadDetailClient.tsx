'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useInfiniteRoadSegments, useRoadFeedback, useAddFeedback, useUpdateMainRoad, useDeleteImage, useDeleteFeedback } from '@/hooks/useRoads';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import StatusSelect from '@/components/ui/StatusSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageModal from '@/components/ui/ImageModal';
import ImageGalleryModal from '@/components/ui/ImageGalleryModal';
import PeopleInvolvedInput from '@/components/ui/PeopleInvolvedInput';
import ArrayInput from '@/components/ui/ArrayInput';
import RoadHistory from '@/components/RoadHistory';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema, FeedbackInput } from '@/lib/schemas';

interface RoadDetailClientProps {
  road: any;
  roadSlug: string;
  renderMode?: 'left-column' | 'middle-column' | 'right-column' | 'bottom-section' | 'mobile-bottom';
}

const DetailField = ({ label, value, editField, type = 'text', placeholder = '', rows = 3, isEditing, editedRoad, handleFieldChange }: any) => {
  const hasPipeSeparator = value && typeof value === 'string' && value.includes('|');
  const hasCommaSeparator = value && typeof value === 'string' && value.includes(',') && !hasPipeSeparator;

  return isEditing ? (
    type === 'textarea' ? (
      <Textarea
        label={label}
        placeholder={placeholder}
        rows={rows}
        value={editedRoad[editField] !== undefined ? editedRoad[editField] : (value || '')}
        onChange={(e) => handleFieldChange(editField, e.target.value)}
      />
    ) : (
      <Input
        label={label}
        type={type}
        step={type === 'number' ? '0.1' : undefined}
        placeholder={placeholder}
        value={editedRoad[editField] !== undefined ? editedRoad[editField] : (value || '')}
        onChange={(e) => handleFieldChange(editField, e.target.value)}
      />
    )
  ) : value ? (
    <div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">{label}</h3>
      {hasPipeSeparator ? (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {value.split('|').map((item: string, idx: number) => (
            <span key={idx} className="inline-block px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
              {item.trim()}
            </span>
          ))}
        </div>
      ) : hasCommaSeparator ? (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {value.split(',').map((item: string, idx: number) => (
            <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
              {item.trim()}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm md:text-base text-gray-900">{value}</p>
      )}
    </div>
  ) : null;
};

const ArrayField = ({ label, values, onEdit, isEditing }: { label: string; values: string[]; onEdit: (v: string[]) => void; isEditing: boolean }) => {
  return isEditing ? (
    <ArrayInput
      label={label}
      values={values}
      onChange={onEdit}
    />
  ) : values && values.length > 0 ? (
    <div>
      <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">{label}</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {values.map((val, idx) => (
          <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
            {val}
          </span>
        ))}
      </div>
    </div>
  ) : null;
};

export default function RoadDetailClient({ road, roadSlug, renderMode = 'left-column' }: RoadDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingProjectId, setIsEditingProjectId] = useState(false);
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [isEditingFinancial, setIsEditingFinancial] = useState(false);
  const [isEditingAuthority, setIsEditingAuthority] = useState(false);
  const [isEditingContractor, setIsEditingContractor] = useState(false);
  const [isEditingLand, setIsEditingLand] = useState(false);
  const [isEditingEnvironmental, setIsEditingEnvironmental] = useState(false);
  const [isEditingTechnical, setIsEditingTechnical] = useState(false);
  const [isEditingOperations, setIsEditingOperations] = useState(false);
  const [isEditingPeople, setIsEditingPeople] = useState(false);

  const [editedRoad, setEditedRoad] = useState<any>({});
  const [editedPeople, setEditedPeople] = useState<any[]>([]);

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'image' | 'feedback'; id: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const {
    data: segmentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRoadSegments(roadSlug);

  const { data: feedbackData, isLoading: feedbackLoading, refetch: refetchFeedback } = useRoadFeedback(roadSlug, 0, 50);

  const updateMainRoad = useUpdateMainRoad(roadSlug);
  const deleteImage = useDeleteImage(roadSlug);
  const deleteFeedback = useDeleteFeedback(roadSlug);
  const addFeedback = useAddFeedback(roadSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedback = feedbackData?.data.feedback || [];
  const allSegments = segmentsData?.pages.flatMap(page => page.data.geojson.features) || [];

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

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowAllImages(false);
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
        onSuccess: () => {
          setDeleteConfirm(null);
          setSelectedImage(null);
          setShowAllImages(false);
          router.refresh();
        },
      });
    } else if (deleteConfirm.type === 'feedback') {
      deleteFeedback.mutate(deleteConfirm.id, {
        onSuccess: () => {
          setDeleteConfirm(null);
          refetchFeedback();
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

  const handleSave = (resetStateFunc: () => void, additionalData?: any) => {
    const submitData = {
      ...editedRoad,
      ...additionalData,
    };

    updateMainRoad.mutate(submitData, {
      onSuccess: () => {
        resetStateFunc();
        setEditedRoad({});
        router.refresh();
      },
    });
  };

  const handleEditBasic = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingBasic(true);
  };
  const handleSaveBasic = () => handleSave(() => setIsEditingBasic(false));
  const handleCancelBasic = () => { setIsEditingBasic(false); setEditedRoad({}); };

  const handleEditProjectId = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingProjectId(true);
  };
  const handleSaveProjectId = () => {
    const dataToSave = { ...editedRoad };
    if (typeof dataToSave.states === 'string') {
      dataToSave.states = dataToSave.states.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    if (typeof dataToSave.districts === 'string') {
      dataToSave.districts = dataToSave.districts.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    handleSave(() => setIsEditingProjectId(false), dataToSave);
  };
  const handleCancelProjectId = () => { setIsEditingProjectId(false); setEditedRoad({}); };

  const handleEditTimeline = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingTimeline(true);
  };
  const handleSaveTimeline = () => handleSave(() => setIsEditingTimeline(false));
  const handleCancelTimeline = () => { setIsEditingTimeline(false); setEditedRoad({}); };

  const handleEditFinancial = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingFinancial(true);
  };
  const handleSaveFinancial = () => {
    const dataToSave = { ...editedRoad };
    if (typeof dataToSave.loan_providers === 'string') {
      dataToSave.loan_providers = dataToSave.loan_providers.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    handleSave(() => setIsEditingFinancial(false), dataToSave);
  };
  const handleCancelFinancial = () => { setIsEditingFinancial(false); setEditedRoad({}); };

  const handleEditAuthority = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingAuthority(true);
  };
  const handleSaveAuthority = () => handleSave(() => setIsEditingAuthority(false));
  const handleCancelAuthority = () => { setIsEditingAuthority(false); setEditedRoad({}); };

  const handleEditContractor = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingContractor(true);
  };
  const handleSaveContractor = () => {
    const dataToSave = { ...editedRoad };
    if (typeof dataToSave.contractor_site_engineers === 'string') {
      dataToSave.contractor_site_engineers = dataToSave.contractor_site_engineers.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    handleSave(() => setIsEditingContractor(false), dataToSave);
  };
  const handleCancelContractor = () => { setIsEditingContractor(false); setEditedRoad({}); };

  const handleEditLand = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingLand(true);
  };
  const handleSaveLand = () => handleSave(() => setIsEditingLand(false));
  const handleCancelLand = () => { setIsEditingLand(false); setEditedRoad({}); };

  const handleEditEnvironmental = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingEnvironmental(true);
  };
  const handleSaveEnvironmental = () => {
    const dataToSave = { ...editedRoad };
    if (typeof dataToSave.pollution_control_reports === 'string') {
      dataToSave.pollution_control_reports = dataToSave.pollution_control_reports.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    handleSave(() => setIsEditingEnvironmental(false), dataToSave);
  };
  const handleCancelEnvironmental = () => { setIsEditingEnvironmental(false); setEditedRoad({}); };

  const handleEditTechnical = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingTechnical(true);
  };
  const handleSaveTechnical = () => handleSave(() => setIsEditingTechnical(false));
  const handleCancelTechnical = () => { setIsEditingTechnical(false); setEditedRoad({}); };

  const handleEditOperations = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedRoad({});
    setIsEditingOperations(true);
  };
  const handleSaveOperations = () => handleSave(() => setIsEditingOperations(false));
  const handleCancelOperations = () => { setIsEditingOperations(false); setEditedRoad({}); };

  const handleEditPeople = () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setEditedPeople(road.people_involved || []);
    setIsEditingPeople(true);
  };
  const handleSavePeople = () => {
    const cleanedPeople = editedPeople.map(({ _id, ...person }: any) => person);
    updateMainRoad.mutate({ people_involved: cleanedPeople }, {
      onSuccess: () => {
        setIsEditingPeople(false);
        setEditedPeople([]);
        router.refresh();
      },
    });
  };
  const handleCancelPeople = () => { setIsEditingPeople(false); setEditedPeople([]); };

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

  if (renderMode === 'left-column') {
    const hasProjectIdData = road.highway_number || road.corridor_name || (road.states && road.states.length > 0) || (road.districts && road.districts.length > 0) || road.start_point || road.end_point || road.total_length_km || road.project_type || road.lane_configuration || road.pavement_type;
    const hasTimelineData = road.promised_start_date || road.actual_start_date || road.progress_percentage || road.reason_for_delay;
    const hasFinancialData = road.approved_project_cost || road.revised_cost || road.mode_of_financing || road.bid_price_winner || road.tender_estimate_govt || (road.loan_providers && road.loan_providers.length > 0) || road.concession_period || road.annuity_details || road.tolling_model;
    const hasContractorData = road.contractor_company_name || road.contractor_cmd_ceo || road.contractor_project_manager || road.contractor_resident_engineer || (road.contractor_site_engineers && road.contractor_site_engineers.length > 0) || road.contractor_quality_control_engineer || road.contractor_safety_engineer || road.contractor_type;

    return (
      <>
        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Basic Details</h2>
            {!isEditingBasic && (
              <button onClick={handleEditBasic} className="text-sm text-blue-600 hover:underline font-medium">
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isEditingBasic ? (
              <StatusSelect
                label="Status"
                value={editedRoad.status !== undefined ? editedRoad.status : road.status}
                onChange={(value) => handleFieldChange('status', value)}
              />
            ) : (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Status</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm">{road.status}</span>
              </div>
            )}

            <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Road Type" value={road.type} editField="type" placeholder="e.g., trunk, primary" isEditing={isEditingBasic} />
            <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Contractor" value={road.contractor} editField="contractor" placeholder="Contractor name" isEditing={isEditingBasic} />
            <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Approved By" value={road.approved_by} editField="approved_by" placeholder="Approving authority" isEditing={isEditingBasic} />

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Total Cost</h3>
              {isEditingBasic ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editedRoad.total_cost !== undefined ? editedRoad.total_cost : road.total_cost}
                  onChange={(e) => handleFieldChange('total_cost', e.target.value)}
                />
              ) : (
                <p className="text-base font-bold">{road.total_cost ? `₹${Number(road.total_cost).toLocaleString('en-IN')}` : 'N/A'}</p>
              )}
            </div>

            <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Maintenance Firm" value={road.maintenance_firm} editField="maintenance_firm" placeholder="Maintenance company" isEditing={isEditingBasic} />

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Promised Completion</h3>
              {isEditingBasic ? (
                <Input
                  type="date"
                  value={editedRoad.promised_completion_date !== undefined ? editedRoad.promised_completion_date : (road.promised_completion_date ? new Date(road.promised_completion_date).toISOString().split('T')[0] : '')}
                  onChange={(e) => handleFieldChange('promised_completion_date', e.target.value)}
                />
              ) : (
                <p className="text-base">{road.promised_completion_date ? new Date(road.promised_completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
              )}
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Actual Completion</h3>
              {isEditingBasic ? (
                <Input
                  type="date"
                  value={editedRoad.actual_completion_date !== undefined ? editedRoad.actual_completion_date : (road.actual_completion_date ? new Date(road.actual_completion_date).toISOString().split('T')[0] : '')}
                  onChange={(e) => handleFieldChange('actual_completion_date', e.target.value)}
                />
              ) : (
                <p className="text-base">{road.actual_completion_date ? new Date(road.actual_completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
              )}
            </div>

            {isEditingBasic && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={handleSaveBasic} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                <Button onClick={handleCancelBasic} variant="secondary">Cancel</Button>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Project Identification</h2>
            {!isEditingProjectId && (
              <button onClick={handleEditProjectId} className="text-sm text-blue-600 hover:underline font-medium">
                Edit
              </button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingProjectId && !hasProjectIdData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Highway Number" value={road.highway_number} editField="highway_number" placeholder="e.g., NH-48" isEditing={isEditingProjectId} />

                {isEditingProjectId ? (
                  <Input
                    label="Corridor Name"
                    type="text"
                    placeholder="e.g., Delhi – Mumbai or Delhi, Mumbai (use – or , to separate)"
                    value={editedRoad.corridor_name !== undefined ? editedRoad.corridor_name : (road.corridor_name || '')}
                    onChange={(e) => handleFieldChange('corridor_name', e.target.value)}
                  />
                ) : road.corridor_name ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Corridor Route</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.corridor_name.split(/[–,]/).filter((city: string) => city.trim()).map((city: string, idx: number, arr: string[]) => (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                          <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap">
                            {city.trim()}
                          </span>
                          {idx < arr.length - 1 && (
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isEditingProjectId ? (
                  <Textarea
                    label="States"
                    placeholder="e.g., Delhi, Haryana, Rajasthan (comma-separated)"
                    rows={2}
                    value={editedRoad.states !== undefined ? (Array.isArray(editedRoad.states) ? editedRoad.states.join(', ') : editedRoad.states) : (road.states ? road.states.join(', ') : '')}
                    onChange={(e) => handleFieldChange('states', e.target.value)}
                  />
                ) : road.states && road.states.length > 0 ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">States</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.states.map((state: string, idx: number) => (
                        <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isEditingProjectId ? (
                  <Textarea
                    label="Districts"
                    placeholder="e.g., New Delhi, Gurugram, Jaipur (comma-separated)"
                    rows={2}
                    value={editedRoad.districts !== undefined ? (Array.isArray(editedRoad.districts) ? editedRoad.districts.join(', ') : editedRoad.districts) : (road.districts ? road.districts.join(', ') : '')}
                    onChange={(e) => handleFieldChange('districts', e.target.value)}
                  />
                ) : road.districts && road.districts.length > 0 ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Districts</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.districts.map((district: string, idx: number) => (
                        <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {district}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Start Point" value={road.start_point} editField="start_point" isEditing={isEditingProjectId} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="End Point" value={road.end_point} editField="end_point" isEditing={isEditingProjectId} />

                {isEditingProjectId ? (
                  <Input
                    label="Total Length (km)"
                    type="number"
                    step="0.1"
                    placeholder="kilometers"
                    value={editedRoad.total_length_km !== undefined ? editedRoad.total_length_km : (road.total_length_km || '')}
                    onChange={(e) => handleFieldChange('total_length_km', e.target.value)}
                  />
                ) : road.total_length_km ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Total Length</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.total_length_km} km</p>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Project Type" value={road.project_type} editField="project_type" placeholder="e.g., Widening" isEditing={isEditingProjectId} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Lane Configuration" value={road.lane_configuration} editField="lane_configuration" placeholder="e.g., 4-lane divided" isEditing={isEditingProjectId} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Pavement Type" value={road.pavement_type} editField="pavement_type" placeholder="e.g., Flexible" isEditing={isEditingProjectId} />

                {isEditingProjectId && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveProjectId} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelProjectId} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Timeline & Progress</h2>
            {!isEditingTimeline && (
              <button onClick={handleEditTimeline} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingTimeline && !hasTimelineData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                {isEditingTimeline ? (
                  <Input
                    label="Promised Start Date"
                    type="date"
                    value={editedRoad.promised_start_date !== undefined ? editedRoad.promised_start_date : (road.promised_start_date ? new Date(road.promised_start_date).toISOString().split('T')[0] : '')}
                    onChange={(e) => handleFieldChange('promised_start_date', e.target.value)}
                  />
                ) : road.promised_start_date ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Promised Start Date</h3>
                    <p className="text-sm md:text-base text-gray-900">{new Date(road.promised_start_date).toLocaleDateString()}</p>
                  </div>
                ) : null}

                {isEditingTimeline ? (
                  <Input
                    label="Actual Start Date"
                    type="date"
                    value={editedRoad.actual_start_date !== undefined ? editedRoad.actual_start_date : (road.actual_start_date ? new Date(road.actual_start_date).toISOString().split('T')[0] : '')}
                    onChange={(e) => handleFieldChange('actual_start_date', e.target.value)}
                  />
                ) : road.actual_start_date ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Actual Start Date</h3>
                    <p className="text-sm md:text-base text-gray-900">{new Date(road.actual_start_date).toLocaleDateString()}</p>
                  </div>
                ) : null}

                {isEditingTimeline ? (
                  <Input
                    label="Progress (%)"
                    type="number"
                    step="0.1"
                    placeholder="percentage"
                    value={editedRoad.progress_percentage !== undefined ? editedRoad.progress_percentage : (road.progress_percentage || '')}
                    onChange={(e) => handleFieldChange('progress_percentage', e.target.value)}
                  />
                ) : road.progress_percentage ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Progress</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.progress_percentage}%</p>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Reason for Delay" value={road.reason_for_delay} editField="reason_for_delay" type="textarea" rows={3} isEditing={isEditingTimeline} />
              </>
            )}

            {isEditingTimeline && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={handleSaveTimeline} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                <Button onClick={handleCancelTimeline} variant="secondary">Cancel</Button>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Financial Details</h2>
            {!isEditingFinancial && (
              <button onClick={handleEditFinancial} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingFinancial && !hasFinancialData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Approved Project Cost" value={road.approved_project_cost ? `₹${road.approved_project_cost} Cr` : null} editField="approved_project_cost" placeholder="Crores" isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Revised Cost" value={road.revised_cost ? `₹${road.revised_cost} Cr` : null} editField="revised_cost" placeholder="Crores" isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Mode of Financing" value={road.mode_of_financing} editField="mode_of_financing" placeholder="e.g., HAM, EPC, BOT" isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Bid Price (Winner)" value={road.bid_price_winner ? `₹${road.bid_price_winner} Cr` : null} editField="bid_price_winner" placeholder="Crores" isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Tender Estimate (Govt)" value={road.tender_estimate_govt ? `₹${road.tender_estimate_govt} Cr` : null} editField="tender_estimate_govt" placeholder="Crores" isEditing={isEditingFinancial} />

                {isEditingFinancial ? (
                  <Textarea
                    label="Loan Providers"
                    placeholder="e.g., ADB, World Bank, JICA (comma-separated)"
                    rows={2}
                    value={editedRoad.loan_providers !== undefined ? (Array.isArray(editedRoad.loan_providers) ? editedRoad.loan_providers.join(', ') : editedRoad.loan_providers) : (road.loan_providers ? road.loan_providers.join(', ') : '')}
                    onChange={(e) => handleFieldChange('loan_providers', e.target.value)}
                  />
                ) : road.loan_providers && road.loan_providers.length > 0 ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Loan Providers</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.loan_providers.map((provider: string, idx: number) => (
                        <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Concession Period" value={road.concession_period} editField="concession_period" isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Annuity Details" value={road.annuity_details} editField="annuity_details" type="textarea" rows={2} isEditing={isEditingFinancial} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Tolling Model" value={road.tolling_model} editField="tolling_model" type="textarea" rows={2} isEditing={isEditingFinancial} />
              </>
            )}

            {isEditingFinancial && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={handleSaveFinancial} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                <Button onClick={handleCancelFinancial} variant="secondary">Cancel</Button>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Contractor Details</h2>
            {!isEditingContractor && (
              <button onClick={handleEditContractor} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingContractor && !hasContractorData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Company Name" value={road.contractor_company_name} editField="contractor_company_name" isEditing={isEditingContractor} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="CMD/CEO" value={road.contractor_cmd_ceo} editField="contractor_cmd_ceo" isEditing={isEditingContractor} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Project Manager" value={road.contractor_project_manager} editField="contractor_project_manager" isEditing={isEditingContractor} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Resident Engineer" value={road.contractor_resident_engineer} editField="contractor_resident_engineer" isEditing={isEditingContractor} />

                {isEditingContractor ? (
                  <Textarea
                    label="Site Engineers"
                    placeholder="e.g., John Doe, Jane Smith, Mike Johnson (comma-separated)"
                    rows={2}
                    value={editedRoad.contractor_site_engineers !== undefined ? (Array.isArray(editedRoad.contractor_site_engineers) ? editedRoad.contractor_site_engineers.join(', ') : editedRoad.contractor_site_engineers) : (road.contractor_site_engineers ? road.contractor_site_engineers.join(', ') : '')}
                    onChange={(e) => handleFieldChange('contractor_site_engineers', e.target.value)}
                  />
                ) : road.contractor_site_engineers && road.contractor_site_engineers.length > 0 ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Site Engineers</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.contractor_site_engineers.map((engineer: string, idx: number) => (
                        <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {engineer}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Quality Control Engineer" value={road.contractor_quality_control_engineer} editField="contractor_quality_control_engineer" isEditing={isEditingContractor} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Safety Engineer" value={road.contractor_safety_engineer} editField="contractor_safety_engineer" isEditing={isEditingContractor} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Contractor Type" value={road.contractor_type} editField="contractor_type" isEditing={isEditingContractor} />

                {isEditingContractor && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveContractor} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelContractor} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  if (renderMode === 'middle-column') {
    const hasAuthorityData = road.ministry || road.approving_authority || road.executing_agency || road.project_director || road.design_consultant || road.pmc_consultant;
    const hasLandData = road.total_land_required_ha || road.private_land_required || road.govt_land_required || road.num_affected_families || road.compensation_amount_paid || road.notification_3a_date || road.notification_3d_date || road.notification_3g_date || road.court_cases || road.encroachment_issues || road.relocation_details;
    const hasEnvironmentalData = road.environmental_clearance_status || road.forest_clearance_stage_1 || road.forest_clearance_stage_2 || road.num_trees_to_cut || road.num_trees_replanted || road.wildlife_clearance || (road.pollution_control_reports && road.pollution_control_reports.length > 0);
    const hasTechnicalData = road.alignment_type || road.carriageway_width || road.median_width || road.shoulder_width || road.embankment_height || road.soil_geotech_report || road.drainage_design || road.service_roads_plan || road.intersections_uturns || road.crash_barrier_specs || road.signage_plan || road.markings_plan;
    const hasOperationsData = road.om_contractor || road.maintenance_period_dlp || road.maintenance_cost;

    return (
      <>
        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Authority & Execution</h2>
            {!isEditingAuthority && (
              <button onClick={handleEditAuthority} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingAuthority && !hasAuthorityData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Ministry" value={road.ministry} editField="ministry" isEditing={isEditingAuthority} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Approving Authority" value={road.approving_authority} editField="approving_authority" isEditing={isEditingAuthority} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Executing Agency" value={road.executing_agency} editField="executing_agency" isEditing={isEditingAuthority} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Project Director" value={road.project_director} editField="project_director" isEditing={isEditingAuthority} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Design Consultant" value={road.design_consultant} editField="design_consultant" isEditing={isEditingAuthority} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="PMC Consultant" value={road.pmc_consultant} editField="pmc_consultant" isEditing={isEditingAuthority} />
              </>
            )}

            {isEditingAuthority && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={handleSaveAuthority} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                <Button onClick={handleCancelAuthority} variant="secondary">Cancel</Button>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Land Acquisition</h2>
            {!isEditingLand && (
              <button onClick={handleEditLand} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingLand && !hasLandData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                {isEditingLand ? (
                  <Input
                    label="Total Land Required (ha)"
                    type="number"
                    step="0.1"
                    placeholder="hectares"
                    value={editedRoad.total_land_required_ha !== undefined ? editedRoad.total_land_required_ha : (road.total_land_required_ha || '')}
                    onChange={(e) => handleFieldChange('total_land_required_ha', e.target.value)}
                  />
                ) : road.total_land_required_ha ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Total Land Required</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.total_land_required_ha} ha</p>
                  </div>
                ) : null}

                {isEditingLand ? (
                  <Input
                    label="Private Land (ha)"
                    type="number"
                    step="0.1"
                    placeholder="hectares"
                    value={editedRoad.private_land_required !== undefined ? editedRoad.private_land_required : (road.private_land_required || '')}
                    onChange={(e) => handleFieldChange('private_land_required', e.target.value)}
                  />
                ) : road.private_land_required ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Private Land</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.private_land_required} ha</p>
                  </div>
                ) : null}

                {isEditingLand ? (
                  <Input
                    label="Govt Land (ha)"
                    type="number"
                    step="0.1"
                    placeholder="hectares"
                    value={editedRoad.govt_land_required !== undefined ? editedRoad.govt_land_required : (road.govt_land_required || '')}
                    onChange={(e) => handleFieldChange('govt_land_required', e.target.value)}
                  />
                ) : road.govt_land_required ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Govt Land</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.govt_land_required} ha</p>
                  </div>
                ) : null}

                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Affected Families" value={road.num_affected_families} editField="num_affected_families" type="number" isEditing={isEditingLand} />

                {isEditingLand ? (
                  <Input
                    label="Compensation Paid (Cr)"
                    type="number"
                    step="0.1"
                    placeholder="Crores"
                    value={editedRoad.compensation_amount_paid !== undefined ? editedRoad.compensation_amount_paid : (road.compensation_amount_paid || '')}
                    onChange={(e) => handleFieldChange('compensation_amount_paid', e.target.value)}
                  />
                ) : road.compensation_amount_paid ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Compensation Paid</h3>
                    <p className="text-sm md:text-base text-gray-900">₹{road.compensation_amount_paid} Cr</p>
                  </div>
                ) : null}

                {isEditingLand ? (
                  <Input
                    label="Notification 3A Date"
                    type="date"
                    value={editedRoad.notification_3a_date !== undefined ? editedRoad.notification_3a_date : (road.notification_3a_date ? new Date(road.notification_3a_date).toISOString().split('T')[0] : '')}
                    onChange={(e) => handleFieldChange('notification_3a_date', e.target.value)}
                  />
                ) : road.notification_3a_date ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Notification 3A Date</h3>
                    <p className="text-sm md:text-base text-gray-900">{new Date(road.notification_3a_date).toLocaleDateString()}</p>
                  </div>
                ) : null}

                {isEditingLand ? (
                  <Input
                    label="Notification 3D Date"
                    type="date"
                    value={editedRoad.notification_3d_date !== undefined ? editedRoad.notification_3d_date : (road.notification_3d_date ? new Date(road.notification_3d_date).toISOString().split('T')[0] : '')}
                    onChange={(e) => handleFieldChange('notification_3d_date', e.target.value)}
                  />
                ) : road.notification_3d_date ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Notification 3D Date</h3>
                    <p className="text-sm md:text-base text-gray-900">{new Date(road.notification_3d_date).toLocaleDateString()}</p>
                  </div>
                ) : null}

                {isEditingLand ? (
                  <Input
                    label="Notification 3G Date"
                    type="date"
                    value={editedRoad.notification_3g_date !== undefined ? editedRoad.notification_3g_date : (road.notification_3g_date ? new Date(road.notification_3g_date).toISOString().split('T')[0] : '')}
                    onChange={(e) => handleFieldChange('notification_3g_date', e.target.value)}
                  />
                ) : road.notification_3g_date ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Notification 3G Date</h3>
                    <p className="text-sm md:text-base text-gray-900">{new Date(road.notification_3g_date).toLocaleDateString()}</p>
                  </div>
                ) : null}
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Court Cases" value={road.court_cases} editField="court_cases" type="textarea" rows={3} isEditing={isEditingLand} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Encroachment Issues" value={road.encroachment_issues} editField="encroachment_issues" type="textarea" rows={3} isEditing={isEditingLand} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Relocation Details" value={road.relocation_details} editField="relocation_details" type="textarea" rows={3} isEditing={isEditingLand} />

                {isEditingLand && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveLand} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelLand} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Environmental Clearances</h2>
            {!isEditingEnvironmental && (
              <button onClick={handleEditEnvironmental} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingEnvironmental && !hasEnvironmentalData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Environmental Clearance" value={road.environmental_clearance_status} editField="environmental_clearance_status" isEditing={isEditingEnvironmental} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Forest Clearance Stage-I" value={road.forest_clearance_stage_1} editField="forest_clearance_stage_1" isEditing={isEditingEnvironmental} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Forest Clearance Stage-II" value={road.forest_clearance_stage_2} editField="forest_clearance_stage_2" isEditing={isEditingEnvironmental} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Trees to Cut" value={road.num_trees_to_cut} editField="num_trees_to_cut" type="number" isEditing={isEditingEnvironmental} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Trees Replanted" value={road.num_trees_replanted} editField="num_trees_replanted" type="number" isEditing={isEditingEnvironmental} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Wildlife Clearance" value={road.wildlife_clearance} editField="wildlife_clearance" isEditing={isEditingEnvironmental} />

                {isEditingEnvironmental ? (
                  <Textarea
                    label="Pollution Control Reports"
                    placeholder="e.g., Report 2023-Q1, Report 2023-Q2, Report 2023-Q3 (comma-separated)"
                    rows={2}
                    value={editedRoad.pollution_control_reports !== undefined ? (Array.isArray(editedRoad.pollution_control_reports) ? editedRoad.pollution_control_reports.join(', ') : editedRoad.pollution_control_reports) : (road.pollution_control_reports ? road.pollution_control_reports.join(', ') : '')}
                    onChange={(e) => handleFieldChange('pollution_control_reports', e.target.value)}
                  />
                ) : road.pollution_control_reports && road.pollution_control_reports.length > 0 ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Pollution Control Reports</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {road.pollution_control_reports.map((report: string, idx: number) => (
                        <span key={idx} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0">
                          {report}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isEditingEnvironmental && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveEnvironmental} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelEnvironmental} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Technical Design</h2>
            {!isEditingTechnical && (
              <button onClick={handleEditTechnical} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingTechnical && !hasTechnicalData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Alignment Type" value={road.alignment_type} editField="alignment_type" isEditing={isEditingTechnical} />

                {isEditingTechnical ? (
                  <Input
                    label="Carriageway Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="meters"
                    value={editedRoad.carriageway_width !== undefined ? editedRoad.carriageway_width : (road.carriageway_width || '')}
                    onChange={(e) => handleFieldChange('carriageway_width', e.target.value)}
                  />
                ) : road.carriageway_width ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Carriageway Width</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.carriageway_width} m</p>
                  </div>
                ) : null}

                {isEditingTechnical ? (
                  <Input
                    label="Median Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="meters"
                    value={editedRoad.median_width !== undefined ? editedRoad.median_width : (road.median_width || '')}
                    onChange={(e) => handleFieldChange('median_width', e.target.value)}
                  />
                ) : road.median_width ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Median Width</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.median_width} m</p>
                  </div>
                ) : null}

                {isEditingTechnical ? (
                  <Input
                    label="Shoulder Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="meters"
                    value={editedRoad.shoulder_width !== undefined ? editedRoad.shoulder_width : (road.shoulder_width || '')}
                    onChange={(e) => handleFieldChange('shoulder_width', e.target.value)}
                  />
                ) : road.shoulder_width ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Shoulder Width</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.shoulder_width} m</p>
                  </div>
                ) : null}

                {isEditingTechnical ? (
                  <Input
                    label="Embankment Height (m)"
                    type="number"
                    step="0.1"
                    placeholder="meters"
                    value={editedRoad.embankment_height !== undefined ? editedRoad.embankment_height : (road.embankment_height || '')}
                    onChange={(e) => handleFieldChange('embankment_height', e.target.value)}
                  />
                ) : road.embankment_height ? (
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-1">Embankment Height</h3>
                    <p className="text-sm md:text-base text-gray-900">{road.embankment_height} m</p>
                  </div>
                ) : null}
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Soil & Geotech Report" value={road.soil_geotech_report} editField="soil_geotech_report" type="textarea" rows={3} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Drainage Design" value={road.drainage_design} editField="drainage_design" type="textarea" rows={3} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Service Roads Plan" value={road.service_roads_plan} editField="service_roads_plan" type="textarea" rows={2} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Intersections & U-turns" value={road.intersections_uturns} editField="intersections_uturns" type="textarea" rows={2} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Crash Barrier Specs" value={road.crash_barrier_specs} editField="crash_barrier_specs" type="textarea" rows={2} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Signage Plan" value={road.signage_plan} editField="signage_plan" type="textarea" rows={2} isEditing={isEditingTechnical} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Markings Plan" value={road.markings_plan} editField="markings_plan" type="textarea" rows={2} isEditing={isEditingTechnical} />

                {isEditingTechnical && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveTechnical} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelTechnical} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Operations & Maintenance</h2>
            {!isEditingOperations && (
              <button onClick={handleEditOperations} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {!isEditingOperations && !hasOperationsData ? (
              <p className="text-gray-500 text-sm italic">No data available</p>
            ) : (
              <>
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="O&M Contractor" value={road.om_contractor} editField="om_contractor" isEditing={isEditingOperations} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Maintenance Period/DLP" value={road.maintenance_period_dlp} editField="maintenance_period_dlp" isEditing={isEditingOperations} />
                <DetailField editedRoad={editedRoad} handleFieldChange={handleFieldChange} label="Maintenance Cost" value={road.maintenance_cost ? `₹${road.maintenance_cost} Cr/yr` : null} editField="maintenance_cost" placeholder="Crores per year" isEditing={isEditingOperations} />

                {isEditingOperations && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button onClick={handleSaveOperations} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                    <Button onClick={handleCancelOperations} variant="secondary">Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  if (renderMode === 'right-column') {
    return (
      <>
        <div className="hidden lg:block">
          <RoadHistory roadSlug={roadSlug} />
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">People Involved</h2>
            {!isEditingPeople && (
              <button onClick={handleEditPeople} className="text-sm text-blue-600 hover:underline font-medium">
                Edit
              </button>
            )}
          </div>
          {isEditingPeople ? (
            <>
              <PeopleInvolvedInput people={editedPeople} onChange={setEditedPeople} />
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button onClick={handleSavePeople} isLoading={updateMainRoad.isPending} variant="primary">Save</Button>
                <Button onClick={handleCancelPeople} variant="secondary">Cancel</Button>
              </div>
            </>
          ) : road.people_involved && road.people_involved.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {road.people_involved.map((person: any, idx: number) => (
                <div key={idx} className="flex-shrink-0 w-64 flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                  {person.image && (
                    <img src={person.image} alt={person.name} className="w-16 h-16 rounded-full object-cover mx-auto" />
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-base">{person.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{person.role}</p>
                    {person.organization && <p className="text-sm text-gray-600 mt-1">{person.organization}</p>}
                    {person.contact && <p className="text-sm text-gray-500 mt-1">{person.contact}</p>}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Images ({road.images?.length || 0})</h2>
            {road.images && road.images.length > 1 && (
              <button onClick={() => setShowAllImages(true)} className="text-sm text-blue-600 hover:underline font-medium">
                View All
              </button>
            )}
          </div>
          {road.images && road.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {road.images.slice(0, 2).map((image: any, idx: number) => {
                const imageUrl = getImageUrl(image);
                const metadata = getImageMetadata(image);
                const canDelete = canDeleteImage(image, user?.username);
                return (
                  <div key={idx} className="relative">
                    <img src={imageUrl} alt={`${road.road_name} - ${idx + 1}`} className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleImageClick(idx)} />
                    {metadata && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {metadata.uploaded_by}
                      </div>
                    )}
                    {canDelete && (
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(imageUrl); }} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No images yet</p>
          )}
          {isAuthenticated && (
            <div className="mt-4">
              <Link href={`/roads/${roadSlug}/upload`}>
                <Button variant="secondary">Upload Image</Button>
              </Link>
            </div>
          )}
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold">Feedback ({feedback.length})</h2>
            {isAuthenticated && (
              <Button onClick={() => setShowFeedbackForm(!showFeedbackForm)} variant="accent" className="text-sm">
                {showFeedbackForm ? 'Cancel' : 'Add'}
              </Button>
            )}
          </div>
          {showFeedbackForm && (
            <form onSubmit={handleSubmit(onSubmitFeedback)} className="mb-4">
              <Textarea label="Your Feedback" placeholder="Share your thoughts..." rows={4} error={errors.comment?.message} {...register('comment')} />
              <div className="mt-3">
                <Button type="submit" isLoading={addFeedback.isPending} variant="primary">Submit Feedback</Button>
              </div>
            </form>
          )}
          {!isAuthenticated && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Login</Link> to add feedback
              </p>
            </div>
          )}
          {feedbackLoading ? (
            <Loading text="Loading feedback..." />
          ) : feedback.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">No feedback yet. Be the first!</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {feedback.map((item: any) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{item.user}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{new Date(item.date.iso).toLocaleDateString()}</span>
                      {user?.username === item.user && (
                        <button onClick={() => handleDeleteFeedback(item.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">
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

        <ImageModal
          isOpen={!!selectedImage}
          imageUrl={selectedImage || ''}
          altText={road.road_name}
          currentIndex={currentImageIndex}
          totalImages={road.images?.length || 0}
          onClose={handleCloseModal}
          onNext={road.images?.length > 1 ? handleNextImage : undefined}
          onPrev={road.images?.length > 1 ? handlePrevImage : undefined}
        />

        <ImageGalleryModal
          isOpen={showAllImages}
          images={road.images || []}
          roadName={road.road_name}
          onClose={handleCloseModal}
          onImageClick={handleImageClick}
          getImageUrl={getImageUrl}
          getImageMetadata={getImageMetadata}
          canDeleteImage={canDeleteImage}
          currentUsername={user?.username}
          onDeleteImage={handleDeleteImage}
        />

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title={deleteConfirm?.type === 'image' ? 'Delete Image' : 'Delete Feedback'}
          message={deleteConfirm?.type === 'image' ? 'Are you sure you want to delete this image? This action cannot be undone.' : 'Are you sure you want to delete this feedback? This action cannot be undone.'}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleteImage.isPending || deleteFeedback.isPending}
        />

        {}
        <div className="lg:hidden">
          <RoadHistory roadSlug={roadSlug} />
        </div>

        {}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold mb-4">Segments ({road.segment_count || 0})</h2>
          {!allSegments || allSegments.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No segments available</p>
          ) : (
            <div className="space-y-2">
              {allSegments.map((segment: any) => {
                const props = segment.properties;
                return (
                  <div key={props.segment_slug} onClick={() => router.push(`/roads/segment/${props.segment_slug}`)} className="bg-gray-50 px-3 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">{props.segment_id}</span>
                      <span className="text-xs px-2 py-0.5 bg-white rounded text-gray-600 whitespace-nowrap">{props.status}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
              {hasNextPage && (
                <div className="pt-3 flex justify-center">
                  <Button onClick={() => fetchNextPage()} variant="secondary" isLoading={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  if (renderMode === 'bottom-section') {
    return null;
  }

  if (renderMode === 'mobile-bottom') {
    return (
      <div className="lg:hidden">
        <RoadHistory roadSlug={roadSlug} />
      </div>
    );
  }

  return null;
}
