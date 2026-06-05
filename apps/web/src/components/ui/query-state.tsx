'use client';

import { ReactNode } from 'react';

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
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  children: ReactNode;
}) {
  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 font-medium">Failed to load data</p>
        <p className="text-sm text-muted mt-2">{error?.message || 'Please ensure the API is running on port 4000'}</p>
      </div>
    );
  }
  return <>{children}</>;
}
