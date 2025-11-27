import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or create an account to track and submit road construction projects on WhoBuiltMyRoad.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

