import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const joinCircleSchema = z.object({
  code: z.string().min(1, { message: 'Invite code cannot be empty' }), 
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const validationResult = joinCircleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const { code } = validationResult.data;

    const circleResult = await db.select({
        id: circles.id,
        name: circles.name
      })
      .from(circles)
      .where(eq(circles.code, code))
      .limit(1);

    if (circleResult.length === 0) {
      return NextResponse.json({ message: 'Invalid invite code.' }, { status: 404 });
    }
    const circle = circleResult[0];
    const circleId = circle.id;

    const existingMembership = await db.select({ id: circle_members.id })
      .from(circle_members)
      .where(and(
        eq(circle_members.user_id, userId),
        eq(circle_members.circle_id, circleId)
      ))
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ message: `You are already a member of "${circle.name}".` }, { status: 409 });
    }

    await db.insert(circle_members).values({
      user_id: userId,
      circle_id: circleId,
    });

    return NextResponse.json({
      message: `Successfully joined the circle "${circle.name}"!`,
      circleId: circleId
    }, { status: 200 });

  } catch (error) {
    console.error('Error joining circle:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 