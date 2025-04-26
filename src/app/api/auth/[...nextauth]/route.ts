import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Helper function to hash password - must match the one used in register route
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to verify password against the stored hash
function verifyPassword(password: string, hash: string): boolean {
  // Since registration uses simple SHA256 without salt, 
  // verification is just re-hashing the input and comparing.
  // NOTE: NOT RECOMMENDED FOR PRODUCTION - use bcrypt or Argon2 instead.
  return crypto.createHash('sha256').update(password).digest('hex') === hash;
}

// Export auth options to use with getServerSession
export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const userResults = await db.select().from(users).where(eq(users.email, credentials.email));
          const user = userResults[0];
          
          console.log('[Authorize] Found DB User:', user);
          
          // Check if user exists, has a password hash, and the password is correct
          if (!user || !user.password_hash || !verifyPassword(credentials.password, user.password_hash)) {
            console.log('[Authorize] Auth failed for:', credentials?.email);
            return null; 
          }
          
          // Return user object (excluding password hash)
          const { password_hash, ...userWithoutPassword } = user;
          console.log('[Authorize] Returning User Object:', userWithoutPassword);
          return userWithoutPassword;
          
        } catch (error) {
          console.error("[Authorize] Auth error:", error);
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('[JWT Callback] User object:', user);
      console.log('[JWT Callback] Initial Token:', token);
      // Add user data to token when first signing in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone_number;
        token.created_at = user.created_at;
        console.log('[JWT Callback] Token updated with user data:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[Session Callback] Received Token:', token);
      console.log('[Session Callback] Initial Session:', session);
      // Add user data from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
        session.user.phone = token.phone as string | null;
        session.user.created_at = token.created_at as Date | string | null;
        console.log('[Session Callback] Session updated with token data:', session);
      }
      return session;
    }
  }
};

// Auth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 