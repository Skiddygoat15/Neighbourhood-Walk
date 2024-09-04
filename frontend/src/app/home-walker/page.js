import React from 'react';

export default function HomeWalker() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">Good morning, Lily! ☀️</p>
      </div>

      <div className="mt-8 w-full px-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="font-semibold">Stars</p>
            <p className="text-xl">⭐ -/5</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="font-semibold">History</p>
          </div>
        </div>

        <div className="mt-8">
          <button className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Search Request
          </button>
        </div>

        <div className="mt-4">
          <button className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Pre-meet
          </button>
        </div>

        <div className="mt-4">
          <button className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Request Respond
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="text-center">
            <p>🏠</p>
            <p className="text-xs">Home</p>
          </button>
          <button className="text-center">
            <p>🔍</p>
            <p className="text-xs">Search</p>
          </button>
          <button className="text-center">
            <p>✉️</p>
            <p className="text-xs">Messages</p>
          </button>
          <button className="text-center">
            <p>📄</p>
            <p className="text-xs">Request</p>
          </button>
          <button className="text-center">
            <p>👤</p>
            <p className="text-xs">Profile</p>
          </button>
        </div>
      </div>
    </div>
  );
}
