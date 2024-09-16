"use client";

import { useRouter } from 'next/navigation';

export default function MyRequestApplication() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">My Request Application</h1>

        {/* Trip Request */}
        <div className="border p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="font-bold">Trip request</span>
            <button className="text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm">Departure: Darling Harbour</p>
          <p className="text-gray-600 text-sm">Destination: Sydney Opera House</p>
          <p className="text-gray-600 text-sm">Estimated time: 8:00 AM Sun 21 July - 8:15 AM Sun 21 July</p>
          <p className="text-sm text-gray-500">Published by 1 hours ago</p>

          {/* Applicants Section */}
          <h2 className="font-bold">Applicants:</h2>
          <div className="border p-4 rounded-lg space-y-2">
            <div className="flex items-center">
              <span className="text-lg font-bold">Lily applied your request!</span>
              <div className="flex items-center ml-auto">
                <button className="text-green-500">Accept</button>
                <button className="text-red-500 ml-4">Reject</button>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg space-y-2">
            <div className="flex items-center">
              <span className="text-lg font-bold">Jack applied your request!</span>
              <div className="flex items-center ml-auto">
                <button className="text-green-500">Accept</button>
                <button className="text-red-500 ml-4">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
