import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Zod schema for input validation
const joinCircleSchema = z.object({
  // Basic validation, could add .length(8) if codes are always 8 chars
  code: z.string().min(1, { message: 'Invite code cannot be empty' }), 
});

export async function POST(req: Request) {
  try {
    // 1. Get Authenticated User
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const validationResult = joinCircleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const { code } = validationResult.data;

    // 3. Find Circle by Invite Code
    const circleResult = await db.select({
        id: circles.id,
        name: circles.name
      })
      .from(circles)
      .where(eq(circles.code, code))
      .limit(1);

    if (circleResult.length === 0) {
      return NextResponse.json({ message: 'Invalid invite code.' }, { status: 404 }); // 404 Not Found
    }
    const circle = circleResult[0];
    const circleId = circle.id;

    // 4. Check if User is Already a Member
    const existingMembership = await db.select({ id: circle_members.id })
      .from(circle_members)
      .where(and(
        eq(circle_members.user_id, userId),
        eq(circle_members.circle_id, circleId)
      ))
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ message: `You are already a member of "${circle.name}".` }, { status: 409 }); // 409 Conflict
    }

    // 5. Add User to Circle
    await db.insert(circle_members).values({
      user_id: userId,
      circle_id: circleId,
    });

    // 6. Return Success Response
    return NextResponse.json({
      message: `Successfully joined the circle "${circle.name}"!`,
      circleId: circleId
    }, { status: 200 }); // 200 OK (or 201 Created if preferred for adding membership)

  } catch (error) {
    console.error('Error joining circle:', error);
    // TODO: Add more specific error handling if needed
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 