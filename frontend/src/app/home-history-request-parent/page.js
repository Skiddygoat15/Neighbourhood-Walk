"use client";

import { useRouter } from 'next/navigation';

export default function HistoryRequestParent() {
  const router = useRouter();

  const handleRateTrip = () => {
    router.push('/home-rate-trip');
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">History Request</h1>

        {/* History Items */}
        <div className="space-y-4">
          {/* First Item */}
          <div className="border p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Lily provide the trip</span>
              <button className="text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm">01/08/2024 4:25PM</p>
            <p className="text-sm">234 Sussex St, Sydney NSW 2000</p>
            <p className="text-sm">356 Crown St, Surry Hills NSW 2010</p>
            <div className="flex justify-between items-center">
              <button onClick={handleRateTrip} className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm">Rate</button>
              <p className="text-sm text-gray-500">4:28 PM - 4:42 PM</p>
            </div>
          </div>

          {/* Additional Items */}
          {/* Add similar blocks for other items, modifying the onClick of the Rate button as needed */}

        </div>
      </div>
    </main>
  );
}
