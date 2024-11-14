"use client";

import { useRouter } from 'next/navigation';

export default function RegistrationVerificationParentSuccessful() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/profile-management-account-information');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white space-y-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Back Button */}
        <div className="flex justify-start">
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>
        </div>


        <h1 className="text-3xl font-bold">Verification - Parent</h1>
        <p className="text-lg text-gray-600 mt-8">
          Verification is <span className="text-green-600">successful</span>, you can proceed to the next page
        </p>

        <button
          onClick={handleStart}
          className="mt-8 w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Start
        </button>
      </div>
    </main>
  );
}
