import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Only handle admin routes
  if (path.startsWith('/admin')) {
    // Get the admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value || '';

    // If trying to access admin routes (except login) without token, redirect to admin login
    if (!adminToken && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access admin login while already logged in, redirect to admin dashboard
    if (adminToken && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/adminDashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 