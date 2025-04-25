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
          
          // No user found
          if (!user) {
            return null;
          }
          
          // Check password
          const hashedPassword = hashPassword(credentials.password);
          
          if (user.password_hash !== hashedPassword) {
            return null;
          }
          
          // Return user (without password hash)
          const { password_hash, ...userWithoutPassword } = user;
          return userWithoutPassword;
          
        } catch (error) {
          console.error("Auth error:", error);
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
    async jwt({ token, user }) {
      // Add user data to token when first signing in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone_number;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
        session.user.phone = token.phone as string | null;
      }
      return session;
    }
  }
};

// Auth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 