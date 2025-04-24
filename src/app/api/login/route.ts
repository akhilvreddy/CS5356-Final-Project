import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Input validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Simple password hashing (in production, use a proper library like bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    const { email, password } = result.data;
    
    // Find user by email
    const userResults = await db.select().from(users).where(eq(users.email, email));
    const user = userResults[0];
    
    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Return user data (excluding password hash)
    const { password_hash, ...userData } = user;
    
    // In a real app, you'd also set session cookies or return a JWT token here
    
    return NextResponse.json({ 
      message: 'Login successful',
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 