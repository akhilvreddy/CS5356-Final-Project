import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Gets the current user's session on the server side
 * 
 * Usage:
 * ```
 * import { getSession } from "@/lib/auth";
 * 
 * export async function MyServerComponent() {
 *   const session = await getSession();
 *   // session.user contains the authenticated user data
 * }
 * ```
 */
export const getSession = async () => {
  return await getServerSession(authOptions);
};

/**
 * Checks if the current user is authenticated
 * 
 * Usage:
 * ```
 * import { isAuthenticated } from "@/lib/auth";
 * 
 * export async function MyServerComponent() {
 *   const isLoggedIn = await isAuthenticated();
 *   // Conditional logic based on authentication status
 * }
 * ```
 */
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session?.user;
}; 