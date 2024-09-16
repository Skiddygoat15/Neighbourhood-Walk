"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function HomeParent() {
  const router = useRouter();
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
      <main className="min-h-screen bg-white flex flex-col items-center">
        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold">Good morning, Emma! ☀️</h1>
        </div>

        {/* Stars and History */}
        <div className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-4 text-center">
              <p className="font-semibold">Stars</p>
              <p className="text-xl">⭐ -/5</p>
            </div>
            <div
                className="bg-white border rounded-lg p-4 text-center cursor-pointer"
                onClick={() => handleNavigation('/home-history-request-parent')}
            >
              <p className="font-semibold">History</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 space-y-4">
            <button
                onClick={() => handleNavigation('/search-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Search Walker
            </button>
            <button
                onClick={() => handleNavigation('/pre-meet-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Messages
            </button>
            <button
                onClick={() => handleNavigation('/request-create')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Request
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="fixed bottom-0 w-full bg-white flex justify-between py-2 border-t shadow-md">
            <button onClick={() => router.push('/home')} className="flex-1 flex flex-col items-center text-center">
              <Image src="/Navigation-icons/home.png" alt="Home" width={24} height={24}/>
              <span className="text-xs mt-1">Home</span>
            </button>
            <button onClick={() => router.push('/search')} className="flex-1 flex flex-col items-center text-center">
              <Image src="/Navigation-icons/lsearch.png" alt="Search" width={24} height={24}/>
              <span className="text-xs mt-1">Search</span>
            </button>
            <button onClick={() => router.push('/messages')} className="flex-1 flex flex-col items-center text-center">
              <Image src="/Navigation-icons/envelope.png" alt="Messages" width={24} height={24}/>
              <span className="text-xs mt-1">Messages</span>
            </button>
            <button onClick={() => router.push('/request')} className="flex-1 flex flex-col items-center text-center">
              <Image src="/Navigation-icons/request.png" alt="Request" width={24} height={24}/>
              <span className="text-xs mt-1">Request</span>
            </button>
            <button onClick={() => router.push('/profile')} className="flex-1 flex flex-col items-center text-center">
              <Image src="/Navigation-icons/profile.png" alt="Profile" width={24} height={24}/>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
      </nav>
</main>
)
  ;
}
