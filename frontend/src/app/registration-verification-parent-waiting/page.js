// pages/SearchParent.js
"use client";
import { useState } from 'react';

export default function SearchParent() {
  const [gender, setGender] = useState('');
  const [distance, setDistance] = useState('');
  const [rating, setRating] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search walkers.."
          className="w-full p-2 mb-4 border rounded-lg"
        />

        {/* Dropdown Filters */}
        <div className="flex justify-between mb-4">
          {/* Gender Dropdown */}
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {/* Distance Dropdown */}
          <div className="relative">
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

          {/* Ratings Dropdown */}
          <div className="relative">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Ratings</option>
              <option value="5stars">5 stars</option>
              <option value="4stars">4 stars & up</option>
              <option value="3stars">3 stars & up</option>
              <option value="2stars">2 stars & up</option>
              <option value="1stars">1 stars & up</option>
            </select>
          </div>
        </div>

        {/* Walkers List */}
        <div className="space-y-4">
          {[1, 2, 3].map((walker) => (
            <div
              key={walker}
              className="border rounded-lg p-4 flex items-center space-x-4"
            >
              {/* Placeholder for Walker Image */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              {/* Walker Details */}
              <div>
                <p className="font-semibold">Walker Name: Example {walker}</p>
                <p>Gender: Female/Male</p>
                <p>Address: Example Address</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
