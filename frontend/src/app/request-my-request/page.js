"use client";

import { useRouter } from 'next/navigation';

export default function MyRequest() {
  const router = useRouter();

  
  const requests = [
    {
      departure: "Darling Harbour",
      destination: "Sydney Opera House",
      estimatedTime: "8:00 AM Sun 21 July - 8:15 AM Sun 21 July",
      publishedTime: "1 hour ago",
    },
    {
      departure: "Darling Harbour",
      destination: "Sydney Opera House",
      estimatedTime: "8:00 AM Thur 04 Aug - 8:25 AM Thur 04 Aug",
      publishedTime: "3 days ago",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title and Create Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My request</h1>
          <button 
            onClick={() => router.push('/request-create')}
            className="py-2 px-4 bg-black text-white rounded-full font-semibold"
          >
            Create new request
          </button>
        </div>

        {/* Request Items */}
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Trip request</h2>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm"><strong>Departure:</strong> {request.departure}</p>
              <p className="text-sm"><strong>Destination:</strong> {request.destination}</p>
              <p className="text-sm"><strong>Estimated time:</strong> {request.estimatedTime}</p>
              <p className="text-xs text-gray-500">Published by {request.publishedTime}</p>
              <div className="flex justify-between mt-2">
                <button 
                  onClick={() => router.push('/request-update')}
                  className="py-2 px-4 bg-black text-white rounded-full text-sm font-semibold"
                >
                  Update
                </button>
                <button 
                  onClick={() => router.push('/cancel-request')} 
                  className="py-2 px-4 bg-black text-white rounded-full text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
