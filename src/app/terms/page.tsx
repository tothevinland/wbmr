import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for WhoBuiltMyRoad. Community-driven platform for tracking road construction projects in India. Read our terms and conditions.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using WhoBuiltMyRoad, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Platform Purpose</h2>
            <p className="text-gray-700 leading-relaxed">
              WhoBuiltMyRoad is a community-driven platform designed to provide transparency about road
              construction and infrastructure projects in India. The platform aggregates user-contributed
              information about roads, contractors, and project details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Independence and Non-Affiliation</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              WhoBuiltMyRoad operates as an independent platform and is:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>NOT affiliated with any government body, ministry, or official agency</li>
              <li>NOT endorsed by or connected to any government institution</li>
              <li>NOT an official government information portal</li>
              <li>Maintained entirely by volunteers and community contributors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. User-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              All information on this platform is crowdsourced and contributed by users. By contributing content, you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Warrant that the information you provide is accurate to the best of your knowledge</li>
              <li>Agree not to post defamatory, false, or misleading information</li>
              <li>Understand that your contributions may be reviewed and moderated</li>
              <li>Grant WhoBuiltMyRoad a license to use, display, and distribute your contributions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Disclaimer of Accuracy</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to maintain accurate information, WhoBuiltMyRoad cannot guarantee the completeness,
              accuracy, or reliability of any data on the platform. Information should be independently verified
              before making any decisions based on it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. No Defamation Intent</h2>
            <p className="text-gray-700 leading-relaxed">
              This platform does not intend to defame, disparage, or misrepresent any government institution,
              contractor, company, or individual. Our purpose is public awareness and transparency, not criticism
              or harm to reputation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              WhoBuiltMyRoad and its contributors shall not be liable for any damages arising from the use of
              this platform or reliance on information provided herein. Use this service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-2">Users must not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Post false, defamatory, or malicious content</li>
              <li>Attempt to hack, disrupt, or compromise the platform</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate others or misrepresent your affiliation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Moderation Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to remove, edit, or reject any content that violates these terms or is
              deemed inappropriate, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the platform after
              changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by the laws of India. Any disputes shall be subject to the
              jurisdiction of courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">12. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, please contact us through the platform or raise an issue
              on our community forums.
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
