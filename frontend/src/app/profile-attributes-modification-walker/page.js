"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileManagementSelectTimeWalker() {
  const router = useRouter();
  const [workingDays, setWorkingDays] = useState('');
  const [times, setTimes] = useState('');
  const [skills, setSkills] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [emailAddress, setEmailAddress] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [preferredName, setPreferredName] = useState('');

  const countryCodes = [
    { code: '+61', country: 'Australia' },
  ];

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleUpdate = () => {
    console.log('Phone Number:', countryCode + phoneNumber);
    console.log('Email Address:', emailAddress);
    console.log('Communication Preference:', communicationPreference);
    console.log('Preferred Name:', preferredName);
    console.log('Working Days:', workingDays);
    console.log('Times:', times);
    console.log('Skills:', skills);
 
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8 overflow-y-auto" style={{maxHeight: 'calc(100vh - 80px)'}}>
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
            <p className="text-xs text-gray-500">You will use this number to receive notifications and to log in and
              restore your account</p>
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
          {/* Working Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Working Days</label>
            <select
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
            >
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Times</label>
            <select
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={times}
                onChange={(e) => setTimes(e.target.value)}
            >
              <option value="">Select a time</option>
              <option value="08:00 - 09:00">08:00 - 09:00</option>
              <option value="09:00 - 10:00">09:00 - 10:00</option>
              <option value="10:00 - 11:00">10:00 - 11:00</option>
              <option value="11:00 - 12:00">11:00 - 12:00</option>
              <option value="12:00 - 13:00">12:00 - 13:00</option>
              <option value="13:00 - 14:00">13:00 - 14:00</option>
              <option value="14:00 - 15:00">14:00 - 15:00</option>
              <option value="15:00 - 16:00">15:00 - 16:00</option>
              <option value="16:00 - 17:00">16:00 - 17:00</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (Multi)</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills"
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

    </main>
  );
}
