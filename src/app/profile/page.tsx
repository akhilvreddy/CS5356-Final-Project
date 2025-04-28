import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";

export default async function ProfilePage() {
  // Check if user is authenticated (server-side)
  const session = await getSession();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = session.user as typeof session.user & {
    created_at?: string | Date | null;
    phone?: string | null;
  };
  
  return (
    <PageLayout>
      <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 mb-8">
            Your Profile
          </h1>
          
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl text-gray-400">
                {session.user.name ? session.user.name[0].toUpperCase() : session.user.email?.[0].toUpperCase() || '?'}
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-200">
                  {session.user.name || 'User'}
                </h2>
                
                <p className="text-gray-400">
                  Member since {session.user.created_at 
                    ? new Date(session.user.created_at).toLocaleDateString() 
                    : 'Date unknown'}
                </p>
                
                {/* <button className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 rounded-lg transition-colors">
                  Edit Profile
                </button> */}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Contact Information</h3>
                <div className="bg-gray-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-400 sm:w-24">Email:</span>
                    <span className="text-gray-200">{session.user.email}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-400 sm:w-24">Phone:</span>
                    <span className="text-gray-200">{session.user.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              {/* <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Account Settings</h3>
                <div className="bg-gray-800/60 rounded-lg p-4 space-y-4">
                  <div>
                    <button className="text-gray-300 hover:text-gray-100 transition-colors text-sm">
                      Change Password
                    </button>
                  </div>
                  
                  <div>
                    <button className="text-gray-300 hover:text-gray-100 transition-colors text-sm">
                      Notification Preferences
                    </button>
                  </div>
                  
                  <div>
                    <button className="text-red-400 hover:text-red-300 transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div> */}
              
              {/* <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Wordle Statistics</h3>
                <div className="bg-gray-800/60 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-200">0</div>
                      <div className="text-xs text-gray-500">Played</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-200">0%</div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-200">0</div>
                      <div className="text-xs text-gray-500">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-200">0</div>
                      <div className="text-xs text-gray-500">Max Streak</div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 