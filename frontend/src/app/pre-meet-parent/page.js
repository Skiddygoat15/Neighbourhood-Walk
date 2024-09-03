"use client";

import { useRouter } from 'next/navigation';

export default function PreMeetParent() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">Pre-meet Card</h1>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-600">
          You need to complete any of the following cards to invite the walker to attend the pre-meet
        </p>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/pre-meet-online')}
            className="w-full py-6 text-center border border-black rounded-lg text-xl"
          >
            Online
          </button>
          <button
            onClick={() => router.push('/pre-meet-f2f')}
            className="w-full py-6 text-center border border-black rounded-lg text-xl"
          >
            Face-to-Face
          </button>
        </div>
      </div>
    </main>
  );
}
