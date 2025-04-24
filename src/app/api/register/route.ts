import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Input validation schema
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(10).max(20).optional(),
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
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.errors }, { status: 400 });
    }
    
    const { name, email, password, phone } = result.data;
    
    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // Hash password
    const password_hash = hashPassword(password);
    
    // Insert new user
    const newUser = await db.insert(users).values({
      name,
      email,
      password_hash,
      phone_number: phone || null,
    }).returning({ id: users.id });
    
    // Return success response (without password hash)
    return NextResponse.json({ 
      message: 'User registered successfully',
      user: { id: newUser[0].id, name, email }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
} 