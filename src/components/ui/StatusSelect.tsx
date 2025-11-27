'use client';

import React, { forwardRef, useState } from 'react';
import { useStatusOptions } from '@/hooks/useRoads';

interface StatusSelectProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const StatusSelect = forwardRef<HTMLSelectElement, StatusSelectProps>(
  ({ label, error, value, onChange, name, ...props }, ref) => {
    const { data: statusData, isLoading } = useStatusOptions();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customValue, setCustomValue] = useState('');

    const statusOptions = statusData?.data?.status_options || [
      'Recently Completed',
      'Under Maintenance',
      'Closed',
      'Active',
      'Planned',
      'Unknown',
      'Other',
    ];

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      if (newValue === 'Other') {
        setShowCustomInput(true);
        setCustomValue('');
      } else {
        setShowCustomInput(false);
        onChange?.(newValue);
      }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setCustomValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          name={name}
          value={showCustomInput ? 'Other' : value}
          onChange={handleSelectChange}
          disabled={isLoading}
          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          {...props}
        >
          <option value="">Select status...</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {showCustomInput && (
          <input
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            placeholder="Enter custom status"
            className="mt-2 w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

StatusSelect.displayName = 'StatusSelect';

export default StatusSelect;
