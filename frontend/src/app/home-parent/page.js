"use client";

import { useRouter } from 'next/navigation';

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
            onClick={() => handleNavigation('/search-walker')}
            className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
          >
            Search Walker
          </button>
          <button
            onClick={() => handleNavigation('/pre-meet-parent')}
            className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
          >
            Pre-meet
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
        <div className="flex justify-around py-2">
          <button className="text-center" onClick={() => handleNavigation('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3z" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="text-center" onClick={() => handleNavigation('/search')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button className="text-center" onClick={() => handleNavigation('/messages')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H7v10h14V10z" />
            </svg>
            <span className="text-xs">Messages</span>
          </button>
          <button className="text-center" onClick={() => handleNavigation('/request')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M3 16h18" />
            </svg>
            <span className="text-xs">Request</span>
          </button>
          <button className="text-center" onClick={() => handleNavigation('/profile')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14l-4-4-4 4" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
