import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WhoBuiltMyRoad',
    short_name: 'WBMR',
    description: 'Track and monitor road construction projects in your area',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#98e5e5',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

