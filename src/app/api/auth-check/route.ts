import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();

  const cookies = request.cookies;
  
  const hasSessionToken = cookies.has('next-auth.session-token') || cookies.has('__Secure-next-auth.session-token');
  
  const cookieInfo = cookies.getAll().map(cookie => ({
    name: cookie.name,
    exists: true,
  }));
  
  
  return NextResponse.json({
    authenticated: !!session,
    hasSessionToken,
    cookieInfo,
    session: session ? {
      user: {
        name: session.user?.name,
        email: session.user?.email,
      },
      expires: session.expires,
    } : null,
  });
} 