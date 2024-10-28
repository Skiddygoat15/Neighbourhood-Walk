"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import useTextColor from '../../ui-background-components/useTextColor';

export default function SearchParentWalkerDetails({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = params;  // obtain dynamic route param
  const [walker, setWalker] = useState(null);  // store walker details
  const [error, setError] = useState(null);    // store error message
  const getUserByIdAPI = `http://${apiUrl}/Users/getUserById/${id}`;
  const textColor = useTextColor();

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
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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
      <BackgroundLayout>
        <main className="h-auto mb-2 shadow-md flex justify-center items-center mx-6">

          <div className="shadow-md w-full" style={{paddingTop: '5px'}}>

            {/* show back icon and title*/}
            <div className="flex items-center mt-2">
              <button onClick={() => handleBack()} className={`mr-4 ${textColor}`}>
                <svg
                    className={`w-6 h-6 ${textColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className={`text-2xl font-semibold ${textColor} text-center`}>Walker details</h1>
            </div>

            {/* Walker Information */}
            <div className="p-4 rounded-lg bg-white shadow-md">
              {error && <p className="text-red-500">{error}</p>}
              {!walker && !error && <p>Loading...</p>}
              {walker && (
                  <div className="space-y-4">
                    <p><strong>Name:</strong> {`${walker.name} ${walker.surname}`}</p>
                    <p><strong>Preferred Name:</strong> {walker.preferredName}</p>
                    <p><strong>Gender:</strong> {walker.gender}</p>
                    <p><strong>Address:</strong> {walker.address}</p>
                    <p><strong>Email:</strong> {walker.email}</p>
                    <p><strong>Phone:</strong> {walker.phone}</p>
                    <p><strong>Communication Preference:</strong> {walker.communicatePref}</p>
                    <p><strong>Preferred time From:</strong></p>
                    <p>{walker.availableDate[0] ? formatDateTime(walker.availableDate[0]) : 'N/A'}</p>
                    <p><strong>Preferred time To:</strong></p>
                    <p>{walker.availableDate[0] ? formatDateTime(walker.availableDate[1]) : 'N/A'}</p>
                    <p><strong>Skill:</strong> {walker.skill}</p>
                    <p><strong>Average Rating:</strong> ⭐ {walker.avgUserRating} / 5</p>
                  </div>
              )}

              {/* Contact Button */}
              <button
                  className="bg-black text-white px-4 py-2 rounded-lg w-full hover:bg-gray-700">
                Contact
              </button>
            </div>
          </div>
        </main>
      </BackgroundLayout>
  );
}
