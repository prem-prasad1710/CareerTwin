import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      dbUserId?: string;
      provider?: string;
      syncPending?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dbUserId?: string;
    provider?: string;
    syncPayload?: Record<string, unknown>;
  }
}
