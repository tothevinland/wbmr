'use client';

import React, { useState } from 'react';
import { useSegmentHistory } from '@/hooks/useRoads';
import Loading from '@/components/ui/Loading';

interface SegmentHistoryProps {
  segmentSlug: string;
}

export default function SegmentHistory({ segmentSlug }: SegmentHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: historyData, isLoading } = useSegmentHistory(segmentSlug, { enabled: isExpanded });

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left flex items-center justify-between"
        >
          <h2 className="text-lg md:text-xl font-bold">Edit History</h2>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <h2 className="text-lg md:text-xl font-bold mb-4">Edit History</h2>
        <Loading text="Loading history..." />
      </div>
    );
  }

  if (!historyData || historyData.data.edit_history.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <button
          onClick={() => setIsExpanded(false)}
          className="w-full text-left flex items-center justify-between mb-4"
        >
          <h2 className="text-lg md:text-xl font-bold">Edit History</h2>
          <svg className="w-5 h-5 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <p className="text-gray-600">No edit history available</p>
      </div>
    );
  }

  const history = historyData.data;

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateTime: { iso: string; timestamp: number; timezone: string }): string => {
    return new Date(dateTime.iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      <button
        onClick={() => setIsExpanded(false)}
        className="w-full text-left flex items-center justify-between mb-4"
      >
        <h2 className="text-lg md:text-xl font-bold">
          Edit History ({history.total_edits} {history.total_edits === 1 ? 'edit' : 'edits'})
        </h2>
        <svg className="w-5 h-5 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="space-y-3">
        {history.edit_history.map((entry, idx) => (
          <div key={idx} className="bg-gray-50 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">{entry.edited_by}</span>
                {entry.action === 'created' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Created</span>
                )}
                {entry.action === 'updated' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Updated</span>
                )}
              </div>
              <span className="text-xs text-gray-500">{formatDate(entry.edited_at)}</span>
            </div>

            <div className="space-y-1">
              {Object.entries(entry.changes).map(([field, change]) => (
                <div key={field} className="text-xs">
                  <span className="font-medium text-gray-700">{formatFieldName(field)}:</span>
                  {change.old === null ? (
                    <span className="ml-1 text-green-700">
                      <span className="font-medium">{change.new || 'empty'}</span>
                    </span>
                  ) : change.old === 'updated' && change.new === 'updated' ? (
                    <span className="ml-1 text-blue-700">Updated</span>
                  ) : (
                    <span className="ml-1">
                      <span className="text-red-700 line-through">{change.old}</span>
                      {' → '}
                      <span className="text-green-700 font-medium">{change.new}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
