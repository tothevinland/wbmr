import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roads - WhoBuiltMyRoad',
  description: 'Browse all approved road construction projects and their details.',
};

export default function RoadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

