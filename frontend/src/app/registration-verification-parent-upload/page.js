"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VerificationWalkerUpload() {
  const router = useRouter();
  const [file1, setFile1] = useState(null);

  const handleFileChange1 = (event) => {
    setFile1(event.target.files[0]);
  };

  const handleNext = () => {
   
    console.log('File uploaded:', file1);

    router.push('/Registration-verification-parent-waiting');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white space-y-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-start">
          <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>
        </div>

        <h1 className="text-3xl font-bold">Verification - Parent</h1>
        <p className="text-lg text-gray-600">Please upload one of your files to verify</p>
        <div className="border-2 border-black rounded-lg p-12 cursor-pointer">
          <label className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange1}
            />
          </label>
        </div>

        <button
          onClick={handleNext}
          className="mt-4 w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </main>
  );
}
