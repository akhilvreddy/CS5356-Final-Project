import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { wordle_scores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { guesses, rawResult } = body;

    if (typeof guesses !== 'number' || !Number.isInteger(guesses) || guesses < 1 || guesses > 7) {
      return NextResponse.json({ message: 'Invalid guess count.' }, { status: 400 });
    }
    if (typeof rawResult !== 'string' || rawResult.trim() === '') {
      return NextResponse.json({ message: 'Invalid raw result.' }, { status: 400 });
    }

    const today = new Date();
    const scoreDateStr = today.toISOString().split('T')[0];

    const existing = await db
      .select({ id: wordle_scores.id })
      .from(wordle_scores)
      .where(
        and(
          eq(wordle_scores.user_id, userId),
          eq(wordle_scores.date, scoreDateStr)
        )
      )
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        { message: 'You already submitted a score for today.' },
        { status: 409 }
      );
    }

    const [inserted] = await db
      .insert(wordle_scores)
      .values({
        user_id: userId,
        date: scoreDateStr,
        guesses,
        raw_result: rawResult,
        submitted_at: new Date(),
      })
      .returning({ id: wordle_scores.id }) as { id: string }[];

    return NextResponse.json(
      {
        message: 'Wordle result submitted successfully!',
        scoreId: inserted.id,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error('Error submitting Wordle result:', err);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
