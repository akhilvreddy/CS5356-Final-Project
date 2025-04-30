import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }
  
  try {
    const userId = session.user.id;
    const userResults = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone_number: users.phone_number,
        created_at: users.created_at
      })
      .from(users)
      .where(eq(users.id, userId));
    
    const user = userResults[0];
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 }
    );
  }
} 