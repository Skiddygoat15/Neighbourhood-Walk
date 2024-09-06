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

    </main>
  );
}
