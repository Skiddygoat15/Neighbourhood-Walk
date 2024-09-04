"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function F2FPreMeetCard() {
  const router = useRouter();
  const [specifiedTime, setSpecifiedTime] = useState('');
  const [meetAddress, setMeetAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = () => {
    
    console.log('Specified Time:', specifiedTime);
    console.log('Pre-meet Address:', meetAddress);
    console.log('Contact Information:', contactInfo);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">F2F Pre-meet Card</h1>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold">Specified time：</label>
            <textarea 
              value={specifiedTime}
              onChange={(e) => setSpecifiedTime(e.target.value)}
              className="w-full p-3 border border-black rounded-lg"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-semibold">Pre-meet Address：</label>
            <textarea 
              value={meetAddress}
              onChange={(e) => setMeetAddress(e.target.value)}
              className="w-full p-3 border border-black rounded-lg"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-semibold">Contact information：</label>
            <textarea 
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full p-3 border border-black rounded-lg"
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Submit
        </button>
      </div>
    </main>
  );
}
