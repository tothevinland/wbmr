import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Road Segment Details',
  description: 'View detailed information about road construction segments in India. Track individual road segments and their status.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
