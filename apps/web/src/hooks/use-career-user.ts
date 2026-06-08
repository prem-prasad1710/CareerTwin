'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useCareerUserId(): string | undefined {
  const { data: session } = useSession();
  return session?.user?.dbUserId;
}

export function useCareerUser() {
  const { data: session, status, update } = useSession();

  const userId = session?.user?.dbUserId;
  const syncPending = session?.user?.syncPending;

  useEffect(() => {
    if (status === 'authenticated' && syncPending && !userId) {
      update();
    }
  }, [status, syncPending, userId, update]);

  return {
    userId,
    name: session?.user?.name,
    email: session?.user?.email,
    image: session?.user?.image,
    provider: session?.user?.provider,
    isLoading: status === 'loading' || (status === 'authenticated' && !userId),
    isAuthenticated: status === 'authenticated',
    syncPending: !!syncPending && !userId,
  };
}
