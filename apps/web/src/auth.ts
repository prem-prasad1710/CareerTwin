import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function syncToBackend(payload: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user.id as string;
  } catch {
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
    }),
    Credentials({
      id: 'demo',
      name: 'Demo Account',
      credentials: {},
      authorize: async () => ({
        id: 'dev-demo',
        email: 'demo@careertwin.ai',
        name: 'Alex Chen',
        image: null,
      }),
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account) {
        const clerkId =
          account.provider === 'credentials'
            ? 'dev-demo-user'
            : `${account.provider}:${account.providerAccountId}`;

        const payload: Record<string, unknown> = {
          clerkId,
          email: user.email || `${account.provider}@oauth.careertwin.ai`,
          firstName: user.name?.split(' ')[0] || 'User',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          avatarUrl: user.image,
          provider: account.provider,
          accessToken: account.access_token,
        };

        if (account.provider === 'github') {
          const gh = profile as { login?: string; html_url?: string; bio?: string; company?: string; location?: string };
          payload.githubUsername = gh?.login;
          payload.githubUrl = gh?.html_url;
          payload.bio = gh?.bio;
          payload.company = gh?.company;
          payload.location = gh?.location;
        }

        if (account.provider === 'google') {
          const g = profile as { given_name?: string; family_name?: string; picture?: string };
          payload.firstName = g?.given_name || payload.firstName;
          payload.lastName = g?.family_name || payload.lastName;
          payload.avatarUrl = g?.picture || payload.avatarUrl;
        }

        const dbUserId = await syncToBackend(payload);
        if (dbUserId) token.dbUserId = dbUserId;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.dbUserId) {
        session.user.dbUserId = token.dbUserId as string;
      }
      if (token.provider) {
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  pages: { signIn: '/sign-in' },
  session: { strategy: 'jwt' },
  trustHost: true,
});
