"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchParent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [selectedWalkers, setSelectedWalkers] = useState([]);

  const walkers = [
    { name: 'Walker 1', gender: 'Male', address: '123 Street', rating: 4 },
    { name: 'Walker 2', gender: 'Female', address: '456 Avenue', rating: 5 },
    // Add more walker data here
  ];

  const filteredWalkers = walkers.filter(walker => {
    return (
      (walker.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (genderFilter === '' || walker.gender === genderFilter) &&
      (addressFilter === '' || walker.address.includes(addressFilter)) &&
      (ratingFilter === '' || walker.rating >= parseInt(ratingFilter))
    );
  });

  const handleWalkerSelection = (walkerName) => {
    setSelectedWalkers((prevSelected) =>
      prevSelected.includes(walkerName)
        ? prevSelected.filter(name => name !== walkerName)
        : [...prevSelected, walkerName]
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Search Bar */}
        <h1 className="text-3xl font-bold text-center">Search</h1>
        <input
          type="text"
          placeholder="Search walkers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
        />

        {/* Filter Options */}
        <div className="flex space-x-2">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            placeholder="Address"
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-black"
          >
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="2">2 Stars & Up</option>
            <option value="1">1 Star & Up</option>
          </select>
        </div>

        {/* Walker List */}
        <div className="space-y-4">
          {filteredWalkers.map((walker, index) => (
            <div key={index} className="border rounded-lg p-4 flex items-center">
              <input
                type="checkbox"
                checked={selectedWalkers.includes(walker.name)}
                onChange={() => handleWalkerSelection(walker.name)}
                className="mr-4"
              />
              <div>
                <p className="font-semibold">Walker Name: {walker.name}</p>
                <p>Gender: {walker.gender}</p>
                <p>Address: {walker.address}</p>
                <p>Rating: {walker.rating} Stars</p> {/* Moved the rating to the bottom */}
              </div>
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
