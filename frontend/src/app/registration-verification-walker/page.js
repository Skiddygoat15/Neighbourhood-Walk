"use client";

import { useRouter } from 'next/navigation';

export default function VerificationWalker() {
  const router = useRouter();

  const handleVerificationOption = (option) => {
    console.log(`Selected option: ${option}`);
    router.push('/Registration-verification-walker-upload');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md space-y-8">
        <button 
          onClick={() => router.back()} 
          className="text-2xl p-2 focus:outline-none"
        >
          &larr;
        </button>


        <h1 className="text-3xl font-bold text-center">Verification - Walker</h1>
        <p className="text-center text-lg text-gray-600">Choose one to verify your account</p>
        <div className="space-y-4">
          <button
            onClick={() => handleVerificationOption('drivers-license')}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            Driver’s License
          </button>
          <button
            onClick={() => handleVerificationOption('state-id')}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            State ID
          </button>
          <button
            onClick={() => handleVerificationOption('passport')}
            className="w-full py-3 text-center border border-black rounded-full text-lg"
          >
            Passport
          </button>
        </div>
      </div>
    </main>
  );
}
