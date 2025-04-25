import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Assuming your session lib is here
import prisma from '@/lib/prisma'; // Assuming your prisma client is here

export async function POST(req: Request) {
  try {
    // 1. Get Authenticated User
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Parse Request Body
    const body = await req.json();
    const { guesses, rawResult } = body;

    // Basic validation
    if (typeof guesses !== 'number' || !Number.isInteger(guesses) || guesses < 1 || guesses > 6) {
      return NextResponse.json({ message: 'Invalid guess count provided.' }, { status: 400 });
    }
    if (typeof rawResult !== 'string' || rawResult.trim() === '') {
      return NextResponse.json({ message: 'Invalid raw result provided.' }, { status: 400 });
    }

    // 3. Prepare Data
    const currentDate = new Date();
    const submittedAt = new Date(); // Capture timestamp
    const scoreDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Normalize date to start of day

    // 4. Database Interaction (using Prisma)
    const newScore = await prisma.wordleScore.create({
      data: {
        userId: userId,
        date: scoreDate, 
        guesses: guesses,
        rawResult: rawResult,
        submittedAt: submittedAt,
      },
    });

    // 5. Return Success Response
    return NextResponse.json({
      message: 'Wordle result submitted successfully!',
      scoreId: newScore.id,
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Error submitting Wordle result:', error);

    // Handle potential Prisma unique constraint errors (e.g., user already submitted for the day)
    // Note: Adjust based on your actual Prisma schema and constraints
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ message: 'You have already submitted a score for this date.' }, { status: 409 }); // 409 Conflict
    }
    
    // Handle other errors
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 