// pages/Search-Parent.js
"use client"; 

import { useState } from 'react';

export default function SearchParent() {
  const [distance, setDistance] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-4">
     
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        
  
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search walkers.."
            className="w-full p-2 border rounded-lg pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
            />
          </svg>
        </div>

   
        <div className="relative mb-4">
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Distance</option>
            <option value="1km">Within 1km</option>
            <option value="2km">Within 2km</option>
          </select>
        </div>


        <div className="space-y-4">
          {[
            { name: "Jack", date: "21st July", duration: "15 mins" },
            { name: "Lucy", date: "16th July", duration: "12 mins" },
            { name: "Alex", date: "26th June", duration: "13 mins" }
          ].map((walker, index) => (
            <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
        
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>

          
              <div>
                <p className="font-semibold">Location: Address - School</p>
                <p>Date: {walker.date}</p>
                <p>Duration: {walker.duration}</p>
              </div>

           
              <div className="ml-auto">
                <button className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <nav className="fixed bottom-0 w-full bg-white border-t py-2">
        <div className="flex justify-around">
          <button className="focus:outline-none">Home</button>
          <button className="focus:outline-none">Search</button>
          <button className="focus:outline-none">Messages</button>
          <button className="focus:outline-none">Request</button>
          <button className="focus:outline-none">Profile</button>
        </div>
      </nav>
    </div>
  );
}
