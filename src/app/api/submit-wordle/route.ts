import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Assuming your session lib is here
// REMOVE Prisma import
// import prisma from '@/lib/prisma'; // Assuming your prisma client is here

// Assuming your Drizzle client and schema are set up like this:
import { db } from '@/db'; // Adjust path if needed
import { wordle_scores } from '@/db/schema';
import { eq, and } from 'drizzle-orm'; // Import 'and' helper

export async function POST(req: Request) {
  try {
    // 1. Get Authenticated User
    const session = await getSession();
    console.log('[/api/submit-wordle] Received Session:', JSON.stringify(session, null, 2)); // Log the session object

    if (!session?.user?.id) {
      console.error('[/api/submit-wordle] Authentication failed or user ID missing in session.');
      return NextResponse.json({ message: 'Not authenticated or user ID missing' }, { status: 401 });
    }
    const userId = session.user.id;
    console.log('[/api/submit-wordle] Extracted userId:', userId); // Log the extracted ID

    // 2. Parse Request Body
    const body = await req.json();
    const { guesses, rawResult } = body;

    // Validation (allow 7 for 'X' guess)
    if (typeof guesses !== 'number' || !Number.isInteger(guesses) || guesses < 1 || guesses > 7) { 
      return NextResponse.json({ message: 'Invalid guess count provided.' }, { status: 400 });
    }
    if (typeof rawResult !== 'string' || rawResult.trim() === '') {
      return NextResponse.json({ message: 'Invalid raw result provided.' }, { status: 400 });
    }

    // 3. Prepare Data
    const currentDate = new Date();
    const submittedAt = new Date(); // Capture timestamp
    const scoreDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Normalize date

    // --- Check for Existing Score --- 
    const existingScore = await db.select({ id: wordle_scores.id })
      .from(wordle_scores)
      .where(and(
        eq(wordle_scores.user_id, userId),
        eq(wordle_scores.date, scoreDate)
      ))
      .limit(1);

    if (existingScore.length > 0) {
      console.log(`User ${userId} already submitted for date ${scoreDate.toISOString().split('T')[0]}`);
      return NextResponse.json({ message: 'You have already submitted a score for this date.' }, { status: 409 }); // 409 Conflict
    }
    // --- End Check ---

    // 4. Database Interaction (using DRIZZLE)
    // TODO: Replace with your actual Drizzle insert logic
    const result = await db.insert(wordle_scores).values({
        user_id: userId,
        date: scoreDate, 
        guesses: guesses,
        raw_result: rawResult,
        submittedAt: submittedAt,
    }).returning({ insertedId: wordle_scores.id }); // Use correct variable name here too

    // Check if insert was successful (Drizzle might return empty array if fails silently)
    if (!result || result.length === 0) {
        // Handle potential unique constraint errors or other insert failures
        // You might need more specific error checking depending on your Drizzle setup/driver
        // For now, assume conflict if insert doesn't return data
        return NextResponse.json({ message: 'Submission failed. You might have already submitted for this date.' }, { status: 409 }); // 409 Conflict
    }

    // 5. Return Success Response
    return NextResponse.json({
      message: 'Wordle result submitted successfully!',
      scoreId: result[0].insertedId, // Assuming returning() returns an array with the object
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting Wordle result:', error);
    // Add more specific Drizzle error handling if needed
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 