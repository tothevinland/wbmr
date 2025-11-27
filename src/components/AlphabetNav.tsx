'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface AlphabetNavProps {
  className?: string;
  variant?: 'mobile' | 'desktop';
}

const AlphabetNav: React.FC<AlphabetNavProps> = ({ className = '', variant = 'mobile' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLetter = searchParams.get('letter');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterClick = (letter: string) => {
    if (currentLetter === letter) {

      router.push('/');
    } else {

      router.push(`/?letter=${letter}`);
    }
  };

  const handleAllClick = () => {
    router.push('/');
  };

  if (variant === 'desktop') {
    return (
      <div className={`bg-white rounded-lg p-2 ${className}`}>
        <div className="mb-1">
          <h3 className="text-xs font-semibold text-gray-700">Filter</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {}
          <button
            onClick={handleAllClick}
            className={`w-6 h-6 rounded font-semibold text-xs transition-all flex-shrink-0 ${
              !currentLetter
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>

          {}
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`w-6 h-6 rounded font-semibold text-xs transition-all flex-shrink-0 ${
                currentLetter === letter
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-3 ${className}`}>
      <div className="mb-2">
        <h3 className="text-xs font-semibold text-gray-700">Filter by Road Name</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {}
        <button
          onClick={handleAllClick}
          className={`w-8 h-8 rounded font-semibold text-xs transition-all ${
            !currentLetter
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>

        {}
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 rounded font-semibold text-xs transition-all ${
              currentLetter === letter
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlphabetNav;
