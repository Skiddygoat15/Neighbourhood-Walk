"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileAttributesModification() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [emailAddress, setEmailAddress] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [preferredName, setPreferredName] = useState('');

  const countryCodes = [
    { code: '+61', country: 'Australia' },
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+86', country: 'China' },
    
  ];

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleUpdate = () => {
    console.log('Phone Number:', countryCode + phoneNumber);
    console.log('Email Address:', emailAddress);
    console.log('Communication Preference:', communicationPreference);
    console.log('Preferred Name:', preferredName);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Profile Attributes Modification</h1>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-xs text-gray-500">You will use this number to receive notifications and to log in and restore your account</p>
            <div className="flex items-center mt-2">
              <select
                className="border border-gray-300 p-2 rounded-l-md"
                value={countryCode}
                onChange={handleCountryChange}
              >
                {countryCodes.map((item, index) => (
                  <option key={index} value={item.code}>
                    {item.country} ({item.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-r-md w-full"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">The system will send you a verification code</p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail Address</label>
            <p className="text-xs text-gray-500">You will use this mailbox to receive messages</p>
            <input
              type="email"
              className="border border-gray-300 p-2 rounded-md w-full mt-2"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <p className="text-xs text-gray-500">The system will send you a verification code</p>
          </div>

          {/* Communication Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Preference</label>
            <select
              className="border border-gray-300 p-2 rounded-md w-full mt-2"
              value={communicationPreference}
              onChange={(e) => setCommunicationPreference(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Preferred Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Name</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full mt-2"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
        >
          Update
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around">
          <button className="py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3z" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button className="py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H7v10h14V10z" />
            </svg>
            <span className="text-xs">Messages</span>
          </button>
          <button className="py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M3 16h18" />
            </svg>
            <span className="text-xs">Request</span>
          </button>
          <button className="py-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14l-4-4-4 4" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
