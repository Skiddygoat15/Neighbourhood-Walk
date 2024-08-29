"use client";

import { useRouter } from 'next/navigation';

export default function SearchParentWalkerDetails() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Walker details</h1>

        {/* Walker Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Walker information</h2>
          <p><strong>Name:</strong> xxxxxxxxxx</p>
          <p><strong>Gender:</strong> xxxxxxxxxx</p>
          <p><strong>Address:</strong> xxxxxxxxxx</p>
          <p><strong>Preferred time:</strong> xxxxxxxxxx</p>
        </div>

        {/* Contact Button */}
        <button className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
          Contact
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto p-4">
          <button onClick={() => router.push('/home-parent')} className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => router.push('/search-parent')} className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9.75 3.75A6 6 0 1015 10a6 6 0 00-5.25-6.25z" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button onClick={() => router.push('/messages')} className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs">Messages</span>
          </button>
          <button onClick={() => router.push('/request')} className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Request</span>
          </button>
          <button onClick={() => router.push('/profile')} className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4a4 4 0 100 8zm0 2c-4 0-8 2-8 6h16c0-4-4-6-8-6z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
