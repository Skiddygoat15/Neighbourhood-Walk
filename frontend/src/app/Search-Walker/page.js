"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchWalker() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');

  const requests = [
    { id: 1, name: 'Jack', location: 'Address - School', date: '21st July', duration: '15 mins', departure: 'Darling Harbour', destination: 'Sydney Opera House', estimatedTime: '8:00 AM Sun 11 Aug - 8:15 AM Sun 11 Aug', published: '1 hour ago' },
    { id: 2, name: 'Lucy', location: 'Address - School', date: '16th July', duration: '12 mins', departure: 'Central Station', destination: 'Town Hall', estimatedTime: '9:00 AM Sun 11 Aug - 9:15 AM Sun 11 Aug', published: '2 hours ago' },
    { id: 3, name: 'Alex', location: 'Address - School', date: '26th June', duration: '13 mins', departure: 'Circular Quay', destination: 'The Rocks', estimatedTime: '10:00 AM Sun 11 Aug - 10:15 AM Sun 11 Aug', published: '3 hours ago' },
    // Add more request data here
  ];

  const filteredRequests = requests.filter(request => {
    return (
      (request.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (addressFilter === '' || request.location.toLowerCase().includes(addressFilter.toLowerCase())) &&
      (timeFilter === '' || request.date.toLowerCase().includes(timeFilter.toLowerCase()))
    );
  });

  const handleDoubleClick = (id) => {
    router.push(`/Search-parent-trip-details?id=${id}`);
  };
  

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Search Bar */}
        <h1 className="text-3xl font-bold text-center">Search</h1>
        <input
          type="text"
          placeholder="Search requests.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
        />

        {/* Filter Options */}
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            placeholder="Filter by Address"
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
          />

          <input
            type="text"
            placeholder="Filter by Date"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        {/* Request List */}
        <div className="space-y-4 mt-4">
          {filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="border rounded-lg p-4 flex items-center justify-between"
              onDoubleClick={() => handleDoubleClick(request.id)} // Navigate to details on double-click
            >
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-semibold">{request.name}</p>
                  <p>Location: {request.location}</p>
                  <p>Date: {request.date}</p>
                  <p>Duration: {request.duration}</p>
                </div>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="text-center" onClick={() => router.push('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3z" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="text-center" onClick={() => router.push('/search')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button className="text-center" onClick={() => router.push('/messages')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H7v10h14V10z" />
            </svg>
            <span className="text-xs">Messages</span>
          </button>
          <button className="text-center" onClick={() => router.push('/request')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M3 16h18" />
            </svg>
            <span className="text-xs">Request</span>
          </button>
          <button className="text-center" onClick={() => router.push('/profile')}>
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
