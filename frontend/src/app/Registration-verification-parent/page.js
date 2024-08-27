"use client";

import { useRouter } from 'next/navigation';


export default function VerificationParent() {
  const router = useRouter();

  const handleVerificationOption = () => {
    console.log('Button clicked');
    router.push('/verification-parent-upload');
  };
  

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="text-2xl p-2 focus:outline-none"
        >
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">Verification - Parent</h1>

        {/* Subtitle */}
        <p className="text-center text-lg text-gray-600">Choose one to verify your account</p>

        {/* Verification Options */}
        <div className="space-y-4">
          <button
            onClick={handleVerificationOption}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            Driver’s License
          </button>
          <button
            onClick={handleVerificationOption}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            State ID
          </button>
          <button
            onClick={handleVerificationOption}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            Passport
          </button>
          <button
            onClick={handleVerificationOption}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            Credit/Debit Card
            <p className="text-sm text-gray-500">The card is only used for verification</p>
          </button>
        </div>
      </div>
    </main>
  );
}