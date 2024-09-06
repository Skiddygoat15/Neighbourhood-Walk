"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateRequest() {
  const router = useRouter();

  // State to hold the request data
  const [departure, setDeparture] = useState("Darling Harbour");
  const [destination, setDestination] = useState("Sydney Opera House");
  const [estimatedTime, setEstimatedTime] = useState("8:00 AM Sun 11 Aug - 8:25 AM Sun 11 Aug");

  const handleUpdate = () => {
    // Logic to handle the update can go here
    console.log('Request updated:', { departure, destination, estimatedTime });
    router.push('/my-request'); // Redirect to My Request page after update
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Update request</h1>

        {/* Update Fields */}
        <div className="space-y-4">
          {/* Departure Field */}
          <div>
            <label className="block text-lg font-medium mb-2">Departure:</label>
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full border-b-2 border-black focus:outline-none"
              />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Destination Field */}
          <div>
            <label className="block text-lg font-medium mb-2">Destination:</label>
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border-b-2 border-black focus:outline-none"
              />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Estimated Time Field */}
          <div>
            <label className="block text-lg font-medium mb-2">Estimated time:</label>
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full border-b-2 border-black focus:outline-none"
              />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
          >
            Update
          </button>
        </div>
      </div>
    </main>
  );
}
