import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members, users, wordle_scores } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

interface CircleMemberWithScore {
  id: string;
  name: string | null;
  guesses: number | null;
  raw_result: string | null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const circleId = parts[parts.length - 1];

    if (!circleId) {
      return NextResponse.json({ message: 'Circle ID is required' }, { status: 400 });
    }

    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    const circleAuthResult = await db
      .select({ 
          name: circles.name,
          memberId: circle_members.id 
      })
      .from(circles)
      .leftJoin(circle_members, and(
          eq(circles.id, circle_members.circle_id),
          eq(circle_members.user_id, userId)
      ))
      .where(eq(circles.id, circleId))
      .limit(1);

    if (circleAuthResult.length === 0) {
      return NextResponse.json({ message: 'Circle not found' }, { status: 404 });
    }
    if (circleAuthResult[0].memberId === null) {
      return NextResponse.json({ message: 'Not authorized to view this circle' }, { status: 403 });
    }
    const circleName = circleAuthResult[0].name;

    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];

    const membersWithScores = await db
      .select({
        id: users.id,
        name: users.name,
        guesses: wordle_scores.guesses,
        raw_result: wordle_scores.raw_result,
      })
      .from(circle_members)
      .innerJoin(users, eq(circle_members.user_id, users.id))
      .leftJoin(wordle_scores, and(
        eq(wordle_scores.user_id, circle_members.user_id),
        sql`DATE(${wordle_scores.date}) = ${todayDateString}` 
      ))
      .where(eq(circle_members.circle_id, circleId))
      .orderBy(users.name);

    const membersData: CircleMemberWithScore[] = membersWithScores.map(m => ({
      id: m.id,
      name: m.name,
      guesses: m.guesses,
      raw_result: m.raw_result
    }));

    return NextResponse.json({
      circleName,
      members: membersData
    }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching circle data:`, error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}