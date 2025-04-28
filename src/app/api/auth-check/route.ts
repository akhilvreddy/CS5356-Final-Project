import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * API route to check authentication status and cookie details
 */
export async function GET(request: NextRequest) {
  // Get session using our helper
  const session = await getSession();
  
  // Get cookies from the request
  const cookies = request.cookies;
  
  // Check for the session token cookie
  const hasSessionToken = cookies.has('next-auth.session-token') || 
                          cookies.has('__Secure-next-auth.session-token');
  
  // Prepare cookie info (without exposing values)
  const cookieInfo = cookies.getAll().map(cookie => ({
    name: cookie.name,
    exists: true,
  }));
  
  
  return NextResponse.json({
    authenticated: !!session,
    hasSessionToken,
    cookieInfo,
    session: session ? {
      // Only include safe session data
      user: {
        name: session.user?.name,
        email: session.user?.email,
        // Don't include id or other sensitive info
      },
      expires: session.expires,
    } : null,
  });
} 