"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalkRequestManagementParent() {
  const router = useRouter();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState({ hour: '', minute: '', period: 'AM' });
  const [arrivalTime, setArrivalTime] = useState({ hour: '', minute: '', period: 'AM' });

  const handlePublish = () => {
    console.log('Request Published');
    console.log('Departure:', departure);
    console.log('Destination:', destination);
    console.log('Date:', date);
    console.log('Estimated Departure Time:', departureTime);
    console.log('Estimated Arrival Time:', arrivalTime);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">Create your request</h1>

        {/* Departure Input */}
        <div>
          <label className="block text-lg font-semibold">Departure:</label>
          <input 
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Enter departure"
            className="w-full p-3 border border-black rounded-lg"
          />
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-lg font-semibold">Destination:</label>
          <input 
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            className="w-full p-3 border border-black rounded-lg"
          />
        </div>

        {/* Estimated Departure */}
        <div>
          <label className="block text-lg font-semibold">Estimated departure:</label>
          <div className="flex space-x-4">
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-black rounded-lg"
            />
            <div className="flex space-x-2">
              <input 
                type="number"
                value={departureTime.hour}
                onChange={(e) => setDepartureTime({ ...departureTime, hour: e.target.value })}
                placeholder="HH"
                className="w-16 p-3 border border-black rounded-lg text-center"
              />
              <span className="text-lg">:</span>
              <input 
                type="number"
                value={departureTime.minute}
                onChange={(e) => setDepartureTime({ ...departureTime, minute: e.target.value })}
                placeholder="MM"
                className="w-16 p-3 border border-black rounded-lg text-center"
              />
              <select 
                value={departureTime.period}
                onChange={(e) => setDepartureTime({ ...departureTime, period: e.target.value })}
                className="p-3 border border-black rounded-lg"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estimated Arrival */}
        <div>
          <label className="block text-lg font-semibold">Estimated Arrival:</label>
          <div className="flex space-x-2">
            <input 
              type="number"
              value={arrivalTime.hour}
              onChange={(e) => setArrivalTime({ ...arrivalTime, hour: e.target.value })}
              placeholder="HH"
              className="w-16 p-3 border border-black rounded-lg text-center"
            />
            <span className="text-lg">:</span>
            <input 
              type="number"
              value={arrivalTime.minute}
              onChange={(e) => setArrivalTime({ ...arrivalTime, minute: e.target.value })}
              placeholder="MM"
              className="w-16 p-3 border border-black rounded-lg text-center"
            />
            <select 
              value={arrivalTime.period}
              onChange={(e) => setArrivalTime({ ...arrivalTime, period: e.target.value })}
              className="p-3 border border-black rounded-lg"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Publish Button */}
        <button 
          onClick={handlePublish}
          className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Publish
        </button>

        {/* Go to History Button */}
        <button 
          onClick={() => router.push('/request-my-request')}
          className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
        >
          Go to History
        </button>
      </div>
    </main>
  );
}
