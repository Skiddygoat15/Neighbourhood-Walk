"use client";

import { useRouter } from 'next/navigation';

export default function RegistrationVerificationParentWaiting() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white space-y-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Back Button */}
        <div className="flex justify-start">
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold">Verification - Parent</h1>

        {/* Success Message */}
        <p className="text-lg text-gray-600 mt-8">
          You have uploaded <span className="text-green-600">successfully!</span><br />
          waiting for verification response
        </p>
      </div>
    </main>
  );
}
