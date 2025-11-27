import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navigation from '@/components/Navigation';
import Script from 'next/script';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://whobuiltmyroad.com'),
  title: {
    default: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
    template: '%s | WhoBuiltMyRoad',
  },
  description: 'Community-driven platform to track road construction projects across India. Know who built your road, check contractor details, project status, and hold authorities accountable for infrastructure development.',
  keywords: [
    'road construction India',
    'infrastructure projects',
    'road contractors',
    'public works',
    'road status',
    'highway construction',
    'national highways',
    'state roads',
    'road accountability',
    'India roads',
    'PWD roads',
    'NHAI projects',
  ],
  authors: [{ name: 'WhoBuiltMyRoad Community' }],
  creator: 'WhoBuiltMyRoad',
  publisher: 'WhoBuiltMyRoad',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://whobuiltmyroad.com',
    title: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
    description: 'Community-driven platform to track road construction projects across India. Know who built your road and hold authorities accountable.',
    siteName: 'WhoBuiltMyRoad',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhoBuiltMyRoad - Track Road Construction Projects in India',
    description: 'Community-driven platform to track road construction projects across India.',
    creator: '@whobuiltmyroad',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: 'https://whobuiltmyroad.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preload" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" as="style" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="h-screen">
        <Providers>
          <Navigation />
          <main className="h-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

