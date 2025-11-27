'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoadSchema, CreateRoadInput } from '@/lib/schemas';
import { useCreateRoad } from '@/hooks/useRoads';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import OSMRoadSearch from '@/components/OSMRoadSearch';
import Breadcrumb from '@/components/Breadcrumb';
import PeopleInvolvedInput from '@/components/ui/PeopleInvolvedInput';
import StatusSelect from '@/components/ui/StatusSelect';
import ArrayInput from '@/components/ui/ArrayInput';

export default function CreateRoadPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const createRoad = useCreateRoad();
  const [selectedOSMRoad, setSelectedOSMRoad] = useState<any>(null);
  const [peopleInvolved, setPeopleInvolved] = useState<any[]>([]);

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loanProviders, setLoanProviders] = useState<string[]>([]);
  const [contractorSiteEngineers, setContractorSiteEngineers] = useState<string[]>([]);
  const [pollutionControlReports, setPollutionControlReports] = useState<string[]>([]);

  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    basic: true,
    identification: false,
    timeline: false,
    financial: false,
    authority: false,
    contractor: false,
    land: false,
    environmental: false,
    technical: false,
    operations: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoadInput>({
    resolver: zodResolver(createRoadSchema),
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleOSMRoadSelect = (road: any) => {
    setSelectedOSMRoad(road);
    setValue('road_name', road.name);

    const coords = road.geometry.coordinates;
    const centerIdx = Math.floor(coords.length / 2);
    const [lng, lat] = coords[centerIdx];
    setValue('location.lat', lat);
    setValue('location.lng', lng);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onSubmit = (data: CreateRoadInput) => {
    if (!selectedOSMRoad) {
      alert('Please select a road from OpenStreetMap');
      return;
    }

    const submitData: any = {
      ...data,
      osm_way_id: selectedOSMRoad.osm_way_id,
      geometry: selectedOSMRoad.geometry,
      people_involved: peopleInvolved.filter(p => p.name && p.role),
      states,
      districts,
      loan_providers: loanProviders,
      contractor_site_engineers: contractorSiteEngineers,
      pollution_control_reports: pollutionControlReports,
    };

    createRoad.mutate(submitData, {
      onSuccess: () => {
        router.push('/roads');
      },
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <svg
        className={`w-5 h-5 transform transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={[{ label: 'Roads', href: '/' }, { label: 'Create Road' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add Road Construction Data</h1>
          <p className="text-gray-600">
            Search for a road from OpenStreetMap and add construction details. All submissions require admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {}
          <OSMRoadSearch
            onSelectRoad={handleOSMRoadSelect}
            centerLat={20.5937}
            centerLng={78.9629}
          />

          {selectedOSMRoad && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-1">
                ✓ OSM Road Selected: {selectedOSMRoad.name}
              </p>
              <p className="text-xs text-green-700">
                Road will display as a line on the map. Construction data will be linked to this road.
              </p>
            </div>
          )}

          <input type="hidden" {...register('location.lat', { valueAsNumber: true })} />
          <input type="hidden" {...register('location.lng', { valueAsNumber: true })} />

          {}
          <div className="space-y-4">
            <SectionHeader title="Basic Information (Required)" section="basic" />
            {expandedSections.basic && (
              <div className="space-y-4 pl-4">
                <Input
                  label="Contractor *"
                  placeholder="e.g., ABC Construction Ltd."
                  error={errors.contractor?.message}
                  {...register('contractor')}
                />

                <Input
                  label="Approved By *"
                  placeholder="e.g., City Council, State Government"
                  error={errors.approved_by?.message}
                  {...register('approved_by')}
                />

                <Input
                  label="Total Cost *"
                  placeholder="e.g., ₹1,00,00,000"
                  error={errors.total_cost?.message}
                  {...register('total_cost')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Promised Completion Date *"
                    type="date"
                    error={errors.promised_completion_date?.message}
                    {...register('promised_completion_date')}
                  />
                  <Input
                    label="Actual Completion Date *"
                    type="date"
                    error={errors.actual_completion_date?.message}
                    {...register('actual_completion_date')}
                  />
                </div>

                <Input
                  label="Maintenance Firm *"
                  placeholder="e.g., XYZ Maintenance Services"
                  error={errors.maintenance_firm?.message}
                  {...register('maintenance_firm')}
                />

                <StatusSelect
                  label="Status *"
                  error={errors.status?.message}
                  value={statusValue}
                  onChange={(value) => setValue('status', value)}
                />

                <Input
                  label="Road Type"
                  placeholder="e.g., trunk, primary, motorway, secondary (optional)"
                  error={errors.type?.message}
                  {...register('type')}
                />

                <PeopleInvolvedInput
                  people={peopleInvolved}
                  onChange={setPeopleInvolved}
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Project Identification" section="identification" />
            {expandedSections.identification && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Highway Number"
                    placeholder="e.g., NH-48, SH-17"
                    {...register('highway_number')}
                  />
                  <Input
                    label="Corridor Name"
                    placeholder="e.g., Delhi-Mumbai Expressway"
                    {...register('corridor_name')}
                  />
                </div>

                <ArrayInput
                  label="States"
                  values={states}
                  onChange={setStates}
                  placeholder="e.g., Punjab, Haryana"
                />

                <ArrayInput
                  label="Districts"
                  values={districts}
                  onChange={setDistricts}
                  placeholder="e.g., Fazilka, Ferozepur"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Point"
                    placeholder="e.g., Ch 0+000, Delhi Border"
                    {...register('start_point')}
                  />
                  <Input
                    label="End Point"
                    placeholder="e.g., Ch 25+500, Jaipur Junction"
                    {...register('end_point')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Total Length (km)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25.5"
                    {...register('total_length_km')}
                  />
                  <Input
                    label="Project Type"
                    placeholder="e.g., Widening, New Construction"
                    {...register('project_type')}
                  />
                  <Input
                    label="Lane Configuration"
                    placeholder="e.g., 4-lane divided"
                    {...register('lane_configuration')}
                  />
                </div>

                <Input
                  label="Pavement Type"
                  placeholder="e.g., Flexible - Bituminous, Rigid - Concrete"
                  {...register('pavement_type')}
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Timeline & Progress" section="timeline" />
            {expandedSections.timeline && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Promised Start Date"
                    type="date"
                    {...register('promised_start_date')}
                  />
                  <Input
                    label="Actual Start Date"
                    type="date"
                    {...register('actual_start_date')}
                  />
                </div>

                <Input
                  label="Progress Percentage"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 45.5"
                  {...register('progress_percentage')}
                />

                <Textarea
                  label="Reason for Delay"
                  placeholder="Explanation for project delays if any..."
                  rows={3}
                  {...register('reason_for_delay')}
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Financial Details" section="financial" />
            {expandedSections.financial && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Approved Project Cost"
                    placeholder="e.g., 250.50 (Crores)"
                    {...register('approved_project_cost')}
                  />
                  <Input
                    label="Revised Cost"
                    placeholder="e.g., 285.75 (Crores)"
                    {...register('revised_cost')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Mode of Financing"
                    placeholder="e.g., HAM - 40:60, EPC, BOT"
                    {...register('mode_of_financing')}
                  />
                  <Input
                    label="Bid Price (Winner)"
                    placeholder="e.g., 245.30 (Crores)"
                    {...register('bid_price_winner')}
                  />
                  <Input
                    label="Tender Estimate (Govt)"
                    placeholder="e.g., 260.00 (Crores)"
                    {...register('tender_estimate_govt')}
                  />
                </div>

                <ArrayInput
                  label="Loan Providers"
                  values={loanProviders}
                  onChange={setLoanProviders}
                  placeholder="e.g., State Bank of India, HDFC Bank"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Concession Period"
                    placeholder="e.g., 15 years, 20 years from COD"
                    {...register('concession_period')}
                  />
                  <Textarea
                    label="Annuity Details"
                    placeholder="Details of annuity payments..."
                    rows={2}
                    {...register('annuity_details')}
                  />
                </div>

                <Textarea
                  label="Tolling Model"
                  placeholder="e.g., Fee-based toll plaza at km 25, Car: Rs.60, Truck: Rs.180"
                  rows={2}
                  {...register('tolling_model')}
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Authority & Execution" section="authority" />
            {expandedSections.authority && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ministry"
                    placeholder="e.g., MoRTH - National Highways Division"
                    {...register('ministry')}
                  />
                  <Input
                    label="Approving Authority"
                    placeholder="e.g., Cabinet Committee on Economic Affairs"
                    {...register('approving_authority')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Executing Agency"
                    placeholder="e.g., NHAI - Regional Office Chandigarh"
                    {...register('executing_agency')}
                  />
                  <Input
                    label="Project Director"
                    placeholder="e.g., Rajesh Kumar, Project Director"
                    {...register('project_director')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Design Consultant"
                    placeholder="e.g., RITES Ltd., STUP Consultants"
                    {...register('design_consultant')}
                  />
                  <Input
                    label="PMC Consultant"
                    placeholder="e.g., AECOM India Pvt Ltd"
                    {...register('pmc_consultant')}
                  />
                </div>
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Contractor Details" section="contractor" />
            {expandedSections.contractor && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contractor Company Name"
                    placeholder="e.g., Larsen & Toubro Ltd"
                    {...register('contractor_company_name')}
                  />
                  <Input
                    label="Contractor CMD/CEO"
                    placeholder="e.g., S N Subrahmanyan, CEO & MD"
                    {...register('contractor_cmd_ceo')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Project Manager"
                    placeholder="e.g., Sunil Mehta, Project Manager"
                    {...register('contractor_project_manager')}
                  />
                  <Input
                    label="Resident Engineer"
                    placeholder="e.g., Vikram Patel, B.Tech Civil"
                    {...register('contractor_resident_engineer')}
                  />
                </div>

                <ArrayInput
                  label="Site Engineers"
                  values={contractorSiteEngineers}
                  onChange={setContractorSiteEngineers}
                  placeholder="e.g., Rahul Kumar - Earthwork"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Quality Control Engineer"
                    placeholder="e.g., Dr. Ashok Reddy"
                    {...register('contractor_quality_control_engineer')}
                  />
                  <Input
                    label="Safety Engineer"
                    placeholder="e.g., Ramesh Yadav, Safety Officer"
                    {...register('contractor_safety_engineer')}
                  />
                  <Input
                    label="Contractor Type"
                    placeholder="e.g., Prime Contractor, JV"
                    {...register('contractor_type')}
                  />
                </div>
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Land Acquisition" section="land" />
            {expandedSections.land && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Total Land Required (ha)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 125.5"
                    {...register('total_land_required_ha')}
                  />
                  <Input
                    label="Private Land Required (ha)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 85.5"
                    {...register('private_land_required')}
                  />
                  <Input
                    label="Govt Land Required (ha)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 40.0"
                    {...register('govt_land_required')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Number of Affected Families"
                    type="number"
                    placeholder="e.g., 125"
                    {...register('num_affected_families')}
                  />
                  <Input
                    label="Compensation Amount Paid"
                    placeholder="e.g., 45.50 (Crores)"
                    {...register('compensation_amount_paid')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Notification 3A Date"
                    type="date"
                    {...register('notification_3a_date')}
                  />
                  <Input
                    label="Notification 3D Date"
                    type="date"
                    {...register('notification_3d_date')}
                  />
                  <Input
                    label="Notification 3G Date"
                    type="date"
                    {...register('notification_3g_date')}
                  />
                </div>

                <Textarea
                  label="Court Cases"
                  placeholder="Details of any court cases related to land acquisition..."
                  rows={3}
                  {...register('court_cases')}
                />

                <Textarea
                  label="Encroachment Issues"
                  placeholder="Details of encroachment issues on the Right of Way..."
                  rows={3}
                  {...register('encroachment_issues')}
                />

                <Textarea
                  label="Relocation Details"
                  placeholder="Details of relocation/rehabilitation of affected persons..."
                  rows={3}
                  {...register('relocation_details')}
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Environmental Clearances" section="environmental" />
            {expandedSections.environmental && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Environmental Clearance Status"
                    placeholder="e.g., Obtained, Pending"
                    {...register('environmental_clearance_status')}
                  />
                  <Input
                    label="Forest Clearance Stage-I"
                    placeholder="e.g., Approved on 10-Mar-2021"
                    {...register('forest_clearance_stage_1')}
                  />
                  <Input
                    label="Forest Clearance Stage-II"
                    placeholder="e.g., Approved on 25-Jun-2021"
                    {...register('forest_clearance_stage_2')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Number of Trees to Cut"
                    type="number"
                    placeholder="e.g., 1250"
                    {...register('num_trees_to_cut')}
                  />
                  <Input
                    label="Number of Trees Replanted"
                    type="number"
                    placeholder="e.g., 5000"
                    {...register('num_trees_replanted')}
                  />
                </div>

                <Input
                  label="Wildlife Clearance"
                  placeholder="e.g., Clearance obtained from NBWL on 15-Aug-2021"
                  {...register('wildlife_clearance')}
                />

                <ArrayInput
                  label="Pollution Control Reports"
                  values={pollutionControlReports}
                  onChange={setPollutionControlReports}
                  placeholder="e.g., Air Quality Report Q1-2023.pdf"
                />
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Technical Design" section="technical" />
            {expandedSections.technical && (
              <div className="space-y-4 pl-4">
                <Input
                  label="Alignment Type"
                  placeholder="e.g., Greenfield, Brownfield"
                  {...register('alignment_type')}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Carriageway Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 14.0"
                    {...register('carriageway_width')}
                  />
                  <Input
                    label="Median Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.0"
                    {...register('median_width')}
                  />
                  <Input
                    label="Shoulder Width (m)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    {...register('shoulder_width')}
                  />
                  <Input
                    label="Embankment Height (m)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.5"
                    {...register('embankment_height')}
                  />
                </div>

                <Textarea
                  label="Soil & Geotech Report"
                  placeholder="Summary or link to geotechnical investigation report..."
                  rows={3}
                  {...register('soil_geotech_report')}
                />

                <Textarea
                  label="Drainage Design"
                  placeholder="Details of drainage system design..."
                  rows={3}
                  {...register('drainage_design')}
                />

                <Textarea
                  label="Service Roads Plan"
                  placeholder="Details of service roads for local connectivity..."
                  rows={2}
                  {...register('service_roads_plan')}
                />

                <Textarea
                  label="Intersections & U-turns"
                  placeholder="Details of intersections, interchanges, and U-turn facilities..."
                  rows={2}
                  {...register('intersections_uturns')}
                />

                <Textarea
                  label="Crash Barrier Specs"
                  placeholder="Specifications of crash barriers and safety features..."
                  rows={2}
                  {...register('crash_barrier_specs')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    label="Signage Plan"
                    placeholder="Road signage plan details..."
                    rows={2}
                    {...register('signage_plan')}
                  />
                  <Textarea
                    label="Markings Plan"
                    placeholder="Road marking specifications..."
                    rows={2}
                    {...register('markings_plan')}
                  />
                </div>
              </div>
            )}
          </div>

          {}
          <div className="space-y-4">
            <SectionHeader title="Operations & Maintenance" section="operations" />
            {expandedSections.operations && (
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="O&M Contractor"
                    placeholder="e.g., XYZ Maintenance Services Ltd"
                    {...register('om_contractor')}
                  />
                  <Input
                    label="Maintenance Period/DLP"
                    placeholder="e.g., 5 years from COD"
                    {...register('maintenance_period_dlp')}
                  />
                  <Input
                    label="Maintenance Cost"
                    placeholder="e.g., 2.5 (Crores per year)"
                    {...register('maintenance_cost')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              variant="primary"
              isLoading={createRoad.isPending}
            >
              Submit for Approval
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Your submission will be reviewed by an administrator
              before appearing publicly on the site. All fields except those marked with * are optional.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
