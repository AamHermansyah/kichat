import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from './routes';

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some((path) => {
    if (path === nextUrl.pathname) return true;
    // Jika ada pathname dinamis
    if (path.includes('/:path')) {
      const pathParts = path.split('/');
      const nextUrlParts = nextUrl.pathname.split('/');
      if (pathParts.length === nextUrlParts.length) {
        for (let i = 0; i < pathParts.length; i++) {
          if (pathParts[i] === ':path') {
            continue;
          }
          if (pathParts[i] !== nextUrlParts[i]) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  });

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}