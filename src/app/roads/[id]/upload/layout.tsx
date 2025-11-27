import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Road Images',
  description: 'Upload images for road construction projects. Help document infrastructure development in India.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
