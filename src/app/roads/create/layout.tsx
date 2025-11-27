import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Road Construction Data',
  description: 'Submit road construction project information to WhoBuiltMyRoad. Help build a transparent database of infrastructure projects in India.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CreateRoadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
