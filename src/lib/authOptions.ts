import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return crypto.createHash('sha256').update(password).digest('hex') === hash;
}

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
          const userResults = await db.select().from(users).where(eq(users.email, credentials.email));
          const user = userResults[0];
          
          console.log('[Authorize] Found DB User:', user);
          
          if (!user || !user.password_hash || !verifyPassword(credentials.password, user.password_hash)) {
            console.log('[Authorize] Auth failed for:', credentials?.email);
            return null; 
          }
          
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
      if (user) {

        const u = user as typeof user & {
            phone_number?: string | null;
            created_at?: string | Date | null;
        };
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.phone = u.phone_number;
        token.created_at = u.created_at;
        console.log('[JWT Callback] Token updated with user data:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[Session Callback] Received Token:', token);
      console.log('[Session Callback] Initial Session:', session);
      
      if (token && session.user) {
        const su = session.user as typeof session.user & {
            phone?: string | null;
            created_at?: string | Date | null;
        };

        su.id = token.id as string;
        su.name = token.name as string | null;
        su.email = token.email as string | null;
        su.phone = token.phone as string | null;
        su.created_at = token.created_at as string | Date | null;
      }
      return session;
    }
  }
};