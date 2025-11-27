'use client';

import React from 'react';
import Link from 'next/link';

interface DisclaimerProps {
  className?: string;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ className = '' }) => {
  return (
    <div className={`bg-amber-50 rounded-lg p-4 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-amber-900">Important Notice</h3>
        <div className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
          <p>
            WhoBuiltMyRoad is an independent, community-driven platform maintained by volunteers and contributors.
            We are not affiliated with, endorsed by, or connected to any government body, agency, or official entity.
          </p>
          <p>
            This platform is created solely for public awareness and transparency. All information is crowdsourced
            and user-contributed. We do not intend to defame, criticize, or misrepresent any government institution,
            contractor, or individual.
          </p>
          <p>
            While we strive for accuracy, we cannot guarantee the completeness or correctness of all data.
            Users are encouraged to verify information independently.
          </p>
        </div>
        <div className="pt-2 text-xs">
          <Link href="/terms" className="text-amber-900 font-medium hover:underline">
            Terms of Service
          </Link>
          <span className="mx-2 text-amber-700">•</span>
          <Link href="/privacy" className="text-amber-900 font-medium hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
