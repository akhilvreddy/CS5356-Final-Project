import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { wordle_scores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    /* ---------- 1. Auth ---------- */
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    /* ---------- 2. Body ---------- */
    const body = await req.json();
    const { guesses, rawResult } = body;

    if (typeof guesses !== 'number' || !Number.isInteger(guesses) || guesses < 1 || guesses > 7) {
      return NextResponse.json({ message: 'Invalid guess count.' }, { status: 400 });
    }
    if (typeof rawResult !== 'string' || rawResult.trim() === '') {
      return NextResponse.json({ message: 'Invalid raw result.' }, { status: 400 });
    }

    /* ---------- 3. Date helpers ---------- */
    const today = new Date(); // e.g. 2025-04-28T…
    const scoreDateStr = today.toISOString().split('T')[0]; // "2025-04-28"

    /* ---------- 4. Uniqueness check ---------- */
    const existing = await db
      .select({ id: wordle_scores.id })
      .from(wordle_scores)
      .where(
        and(
          eq(wordle_scores.user_id, userId),
          eq(wordle_scores.date, scoreDateStr)   // <- compare string to string
        )
      )
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        { message: 'You already submitted a score for today.' },
        { status: 409 }
      );
    }

    /* ---------- 5. Insert ---------- */
    const [inserted] = await db
      .insert(wordle_scores)
      .values({
        user_id: userId,
        date: scoreDateStr,        // <- store as string
        guesses,
        raw_result: rawResult,
        submittedAt: new Date(),   // timestamp column is fine as Date
      })
      .returning({ id: wordle_scores.id }) as { id: string }[];

    /* ---------- 6. Response ---------- */
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
