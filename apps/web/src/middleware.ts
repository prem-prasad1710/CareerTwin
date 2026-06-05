import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isSignIn = req.nextUrl.pathname.startsWith('/sign-in');

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isSignIn && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};
