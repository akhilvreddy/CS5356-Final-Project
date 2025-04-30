import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const firstName = session.user.name?.split(' ')[0] || 'there';
  
  return (
    <PageLayout>
      <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 mb-6">
            Welcome, {firstName}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">New Circles</h2>
              <p className="text-gray-400 mb-6">Create a circle or join an existing one.</p>
              
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/create-circle"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Circle
                </Link>
                <Link 
                  href="/join-circle"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Join Circle
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Today's Wordle</h2>
              <p className="text-gray-400 mb-6">Have you completed your Wordle puzzle today? Share your results with your circles!</p>
              
              <Link 
                href="/submit-wordle"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm transition-colors inline-block"
              >
                Submit Wordle Result
              </Link>
            </div>
          </div>
          
          <div className="mt-10 mb-10">

            <div className="flex items-center justify-center">
              <Link
                href="/view-circles"
                className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 
                          flex items-center justify-center 
                          text-white font-semibold text-lg 
                          hover:scale-105 hover:shadow-2xl transition-all duration-300 
                          focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                View Wordle Circles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 