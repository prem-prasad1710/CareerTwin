'use client';

import { ReactNode } from 'react';
import { useCareerUser } from '@/hooks/use-career-user';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No data available yet.',
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}) {
  const { userId, syncPending, isAuthenticated, isLoading: userLoading } = useCareerUser();

  if (isLoading || userLoading || syncPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner />
        <p className="text-sm text-muted">
          {syncPending ? 'Syncing your Career Twin profile…' : 'Loading…'}
        </p>
      </div>
    );
  }

  if (isAuthenticated && !userId) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-lg mx-auto">
        <p className="text-amber-400 font-medium">Could not connect to your profile</p>
        <p className="text-sm text-muted mt-2">
          The API may be offline or not configured. Make sure the backend is running on port 4000
          and the database is seeded. Try signing out and back in.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-lg mx-auto">
        <p className="text-red-400 font-medium">Failed to load data</p>
        <p className="text-sm text-muted mt-2">
          {error?.message || 'Please ensure the API is running on port 4000'}
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
