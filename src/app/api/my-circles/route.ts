import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    const userCircles = await db
      .select({
        id: circles.id,
        name: circles.name,
      })
      .from(circles)
      .innerJoin(circle_members, eq(circles.id, circle_members.circle_id))
      .where(eq(circle_members.user_id, userId))
      .orderBy(circles.name);

    return NextResponse.json({ circles: userCircles }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user circles:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 