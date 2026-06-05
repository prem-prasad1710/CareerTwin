'use client';

import { useSession } from 'next-auth/react';

export function useCareerUserId(): string | undefined {
  const { data: session, status } = useSession();
  if (status === 'loading') return undefined;
  return session?.user?.dbUserId;
}

export function useCareerUser() {
  const { data: session, status } = useSession();
  return {
    userId: session?.user?.dbUserId,
    name: session?.user?.name,
    email: session?.user?.email,
    image: session?.user?.image,
    provider: session?.user?.provider,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
