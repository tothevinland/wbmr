'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortDropdownProps {
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ className = '' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSortBy = searchParams.get('sort_by') || 'created_at';
  const currentSortOrder = searchParams.get('sort_order') || 'desc';
  const currentLetter = searchParams.get('letter');

  const sortOptions = [
    { value: 'road_name', label: 'Road Name', icon: '🛣️' },
    { value: 'created_at', label: 'Date Added', icon: '📅' },
    { value: 'status', label: 'Status', icon: '📊' },
    { value: 'contractor', label: 'Contractor', icon: '👷' },
  ];

  const orderOptions = [
    { value: 'asc', label: 'Ascending (A-Z, Old-New)', icon: '⬆️' },
    { value: 'desc', label: 'Descending (Z-A, New-Old)', icon: '⬇️' },
  ];

  const getCurrentLabel = () => {
    const sortOption = sortOptions.find((opt) => opt.value === currentSortBy);
    const orderOption = orderOptions.find((opt) => opt.value === currentSortOrder);
    return `${sortOption?.label} (${currentSortOrder === 'asc' ? 'A-Z' : 'Z-A'})`;
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams();
    params.set('sort_by', sortBy);
    params.set('sort_order', sortOrder);

    if (currentLetter) {
      params.set('letter', currentLetter);
    }

    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Sort: {getCurrentLabel()}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">SORT BY</div>
            {sortOptions.map((option) => (
              <div key={option.value} className="mb-1">
                <div className="px-3 py-1.5 text-xs font-medium text-gray-700 flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
                <div className="pl-8 space-y-1">
                  {orderOptions.map((order) => (
                    <button
                      key={`${option.value}-${order.value}`}
                      onClick={() => handleSortChange(option.value, order.value)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        currentSortBy === option.value && currentSortOrder === order.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{order.icon}</span>
                        <span>{order.value === 'asc' ? 'A-Z / Old-New' : 'Z-A / New-Old'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
