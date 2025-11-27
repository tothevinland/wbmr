import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for WhoBuiltMyRoad. Learn how we collect, use, and protect your data on our community-driven road tracking platform in India.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              WhoBuiltMyRoad respects your privacy and is committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>

            <h3 className="text-xl font-medium mb-2 mt-4">2.1 Account Information</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Email address</li>
              <li>Username</li>
              <li>Password (encrypted)</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.2 Content You Submit</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              When you contribute to the platform, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Road information and details</li>
              <li>Photos and images you upload</li>
              <li>Comments and feedback</li>
              <li>Location data related to road projects</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.3 Usage Data</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              We automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Provide and maintain the platform</li>
              <li>Display road information and project details</li>
              <li>Authenticate users and manage accounts</li>
              <li>Improve user experience and platform functionality</li>
              <li>Monitor for prohibited activities and moderate content</li>
              <li>Communicate important updates or changes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Public Information</h2>
            <p className="text-gray-700 leading-relaxed">
              Please note that road information, photos, and contributions you submit are publicly visible
              to all users of the platform. Do not submit personal or sensitive information in these
              public contributions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We do not sell your personal information. We may share data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>When required by law or legal process</li>
              <li>To protect the rights and safety of users</li>
              <li>With service providers who help operate the platform (with strict confidentiality agreements)</li>
              <li>In anonymized, aggregated form for research or analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement reasonable security measures to protect your information, including encryption
              of passwords and secure data transmission. However, no internet transmission is completely
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to maintain your session, remember preferences, and
              analyze platform usage. You can control cookie settings through your browser, though this
              may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of non-essential communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide
              services. Public contributions may remain on the platform even after account deletion to
              maintain data integrity, though they will be anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              WhoBuiltMyRoad is not intended for users under 13 years of age. We do not knowingly collect
              information from children. If you believe a child has provided information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform may use third-party services like mapping providers. These services have their
              own privacy policies, and we are not responsible for their practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">12. Changes to Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify users of significant changes
              through the platform or email. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For privacy-related questions, data requests, or concerns, please contact us through the
              platform or community forums.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
