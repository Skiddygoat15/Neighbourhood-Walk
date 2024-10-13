"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchParentWalkerDetails({ params }) {
  const router = useRouter();
  const { id } = params;  // obtain dynamic route param
  const [walker, setWalker] = useState(null);  // store walker details
  const [error, setError] = useState(null);    // store error message
  const getUserByIdAPI = `http://127.0.0.1:8080/Users/getUserById/${id}`;

  // get walker details info by walker's id
  useEffect(() => {
    if (id) {
      fetchWalkerDetails();
    }
  }, [id]);

  const fetchWalkerDetails = async () => {
    try {
      const response = await fetch(getUserByIdAPI, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch walker details');
      }

      const data = await response.json();
      setWalker(data);  // store returned walker info
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    router.push(`/search-parent`);  // back to search walkers page
  };

  // format the available times
  const formatDateTime = (inputDateTime) => {
    console.log(inputDateTime);
    const dateTime = new Date(inputDateTime);
    console.log(inputDateTime);
    // options is a configuration object, as parameter of Intl.DateTimeFormat
    const options = {
      year: 'numeric',      // Display the full year (e.g., 2024)
      month: 'short',       // Display the abbreviated month name (e.g., Sept)
      day: 'numeric',       // Display the numeric day of the month (e.g., 16)
      weekday: 'short',     // Display the abbreviated weekday name (e.g., Mon)
      hour: 'numeric',      // Display the hour
      minute: 'numeric',    // Display the minutes
      hour12: true          // Display 12-hour time format (AM/PM)
    };
    // Using en-AU (Australia) locale
    const formattedDateTime = new Intl.DateTimeFormat('en-AU', options).format(dateTime);
    return `${formattedDateTime}`;
  };

  return (
    <main className="min-h-screen bg-white mb-20">
      <div className="max-w-md mx-auto p-4 space-y-8">
        <div>
          {/* Back Button */}
          <button onClick={() => handleBack()} className="text-2xl p-2 focus:outline-none">
            &larr;
          </button>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center">Walker details</h1>
        </div>

        {/* Walker Information */}
        {error && <p className="text-red-500">{error}</p>}
        {!walker && !error && <p>Loading...</p>}
        {walker && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Walker information</h2>
              <p><strong>Name:</strong> {`${walker.name} ${walker.surname}`}</p>
              <p><strong>Preferred Name:</strong> {walker.preferredName}</p>
              <p><strong>Gender:</strong> {walker.gender}</p>
              <p><strong>Address:</strong> {walker.address}</p>
              <p><strong>Email:</strong> {walker.email}</p>
              <p><strong>Phone:</strong> {walker.phone}</p>
              <p><strong>Communication Preference:</strong> {walker.communicatePref}</p>
              <p><strong>Preferred time From:</strong> </p>
              <p>{walker.availableDate[0] ? formatDateTime(walker.availableDate[0]) : 'N/A'}</p>
              <p><strong>Preferred time To:</strong> </p>
              <p>{walker.availableDate[0] ? formatDateTime(walker.availableDate[1]) : 'N/A'}</p>
              <p><strong>Skill:</strong> {walker.skill}</p>
              <p><strong>Average Rating:</strong> ⭐ {walker.avgUserRating} / 5</p>
            </div>
        )}

        {/* Contact Button */}
        <button className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800">
          Contact
        </button>
      </div>

    </main>
  );
}
