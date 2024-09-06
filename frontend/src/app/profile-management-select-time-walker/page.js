"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileManagementSelectTimeWalker() {
  const router = useRouter();
  const [workingDays, setWorkingDays] = useState('');
  const [times, setTimes] = useState('');
  const [skills, setSkills] = useState('');

  const handleUpdate = () => {
    
    console.log('Working Days:', workingDays);
    console.log('Times:', times);
    console.log('Skills:', skills);
 
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Available Dates/ Times</h1>

        {/* Form Fields */}
        <div className="space-y-4">
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
