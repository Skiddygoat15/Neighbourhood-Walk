// src/app/Search-Walker-request-information-details/page.js
"use client"; 

import { useRouter } from 'next/navigation'; 

export default function RequestDetails() {
  const router = useRouter(); 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">
     
      <div className="bg-white p-4 shadow-md w-full max-w-md mx-auto">
 
        <div className="flex items-center mb-4">
          <button onClick={() => router.back()} className="mr-4">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Request details</h1>
        </div>


        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Trip request</h2>

          <div className="mb-4">
            <p className="text-gray-600">Departure:</p>
            <p className="text-black text-lg">Darling Harbour</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Destination:</p>
            <p className="text-black text-lg">Sydney Opera House</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Estimated time:</p>
            <p className="text-black text-lg">
              8:00 AM Sun 11 Aug - 8:15 AM Sun 11 Aug
            </p>
          </div>

          <div className="mb-4 text-gray-500">
            Published by 1 hour ago
          </div>

       
          <button className="bg-black text-white px-4 py-2 rounded-lg w-full">
            Apply
          </button>
        </div>
      </div>

    </div>
  );
}
