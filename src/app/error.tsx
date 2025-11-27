'use client';

import { useEffect } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 md:pt-28">
      <ErrorMessage
        message={error.message || 'Something went wrong'}
        onRetry={reset}
      />
    </div>
  );
}

