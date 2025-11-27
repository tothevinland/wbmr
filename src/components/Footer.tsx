'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">WhoBuiltMyRoad</h3>
            <p className="text-sm leading-relaxed">
              A community-driven platform for transparency in road infrastructure projects across India.
              Independent, volunteer-maintained, and dedicated to public awareness.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-3">About</h3>
            <p className="text-sm leading-relaxed">
              Not affiliated with any government body. All information is user-contributed and maintained
              by volunteers. We do not intend to defame any entity.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm">
          <p>
            &copy; {currentYear} WhoBuiltMyRoad. Community-maintained platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

