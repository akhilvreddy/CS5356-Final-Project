import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { circles, circle_members } from '@/db/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';

// Zod schema for input validation
const createCircleSchema = z.object({
  name: z.string().min(1, { message: 'Circle name cannot be empty' }).max(100, { message: 'Circle name too long' }),
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
    const validationResult = createCircleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name } = validationResult.data;

    // 3. Generate Unique Invite Code
    // TODO: Could add logic to ensure code is truly unique if collisions were a concern, 
    // but nanoid (8 chars) makes collisions extremely unlikely.
    const code = nanoid(8); // Generate an 8-character unique code

    let newCircleData: { id: string; code: string } | null = null;

    // 4. Database Interaction (Transaction)
    await db.transaction(async (tx) => {
      // Insert the new circle
      const newCircleResult = await tx.insert(circles).values({
        name: name,
        code: code,
        creator_id: userId, 
      }).returning({ id: circles.id, code: circles.code });

      if (!newCircleResult || newCircleResult.length === 0) {
        throw new Error('Failed to create circle record.');
      }
      const newCircle = newCircleResult[0];

      // Add the creator as the first member
      await tx.insert(circle_members).values({
        user_id: userId,
        circle_id: newCircle.id, 
      });
      
      newCircleData = newCircle; // Store result to return outside transaction
    });

    if (!newCircleData) {
      throw new Error('Transaction failed to return circle data.');
    }

    // 5. Return Success Response
    return NextResponse.json({
      message: 'Circle created successfully!',
      circleId: newCircleData.id,
      inviteCode: newCircleData.code
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating circle:', error);
    // TODO: Add more specific error handling (e.g., for potential code collisions if retries were added)
    return NextResponse.json({ message: error instanceof Error ? error.message : 'An internal server error occurred.' }, { status: 500 });
  }
} 