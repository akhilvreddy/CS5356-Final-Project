import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members } from '@/db/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';

/* ----------  Schema ---------- */
const createCircleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Circle name cannot be empty' })
    .max(100, { message: 'Circle name too long' }),
});

/* ----------  Route ---------- */
export async function POST(req: Request) {
  try {
    /* 1. Auth */
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    /* 2. Validate body */
    const body = await req.json();
    const parsed = createCircleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name } = parsed.data;

    /* 3. Prepare data */
    const code = nanoid(8); // unique invite code

    /* 4. Create circle + add creator (single transaction) */
    let newCircle!: { id: string; code: string }; // definite-assignment

    await db.transaction(async (tx) => {
      const res = await tx
        .insert(circles)
        .values({ name, code, creator_id: userId })
        .returning({ id: circles.id, code: circles.code }) as { id: string; code: string }[];

      if (!res.length) throw new Error('Failed to create circle record.');
      newCircle = res[0];

      await tx.insert(circle_members).values({
        user_id: userId,
        circle_id: newCircle.id,
      });
    });

    /* 5. Respond */
    return NextResponse.json(
      {
        message: 'Circle created successfully!',
        circleId: newCircle.id,
        inviteCode: newCircle.code,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating circle:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error.' },
      { status: 500 }
    );
  }
}
