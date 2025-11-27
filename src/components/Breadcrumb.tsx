'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4 md:mb-6 overflow-hidden">
      <Link href="/" className="hover:text-black transition-colors flex-shrink-0">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <svg className="w-4 h-4 mx-1 md:mx-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-black transition-colors truncate max-w-[100px] md:max-w-none">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-medium truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
