// pages/Search-Parent.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function SearchParent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  let parentId = null;
  let token = null;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    parentId = sessionStorage.getItem('userId');
    token = sessionStorage.getItem('token');
  }
  const [gender, setGender] = useState('');
  const [distance, setDistance] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [walkers, setWalkers] = useState([]);  // store walkers list
  const [error, setError] = useState(null);    // store error message
  const textColor = useTextColor();

  useEffect(() => {
    if (searchTerm === '') {
      handleSearch();  // If the search box is empty, perform a search for all walkers
    }
  }, [searchTerm, gender, distance, rating]);

  const handleClear = () => {
    setSearchTerm('');
    setGender('');
    setDistance('');
    setRating('');
  }; // empty searchTerm and all filters

  const handleSearch = async () => {
    setWalkers([]); // Clear previous results when clicking the search button.
    setError(null); // Clear the previous error message

    const searchWalkersAPI = `${apiUrl}/Users/searchWalkers?parentId=${parentId}&searchTerm=${searchTerm}&gender=${gender}&distance=${distance}&rating=${rating}`;

    try {
      const response = await fetch(searchWalkersAPI, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      console.log(response);

      const contentType = response.headers.get('Content-Type');
      if (!response.ok) {
        if (response.status === 403) {
          alert('Please log in.');
          router.push('/login');
          return;
        }

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error fetching walkers');
        } else {
          throw new Error('Unexpected non-JSON response');
        }
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setWalkers(data);
        setError(null);
      } else {
        throw new Error('Invalid response type, expected JSON');
      }
    } catch (error) {
      console.error("Search Walkers failed:", error);
      setError(error.message || 'An unknown error occurred.');
      setWalkers([]);
    }

  };

  // Listens for keyboard presses and performs searches
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleWalkerClick = (id) => {
    router.push(`/search-parent-walker-details/${id}`);
  };

  return (
      <BackgroundLayout>
        <div className="bg-opacity-75 p-4 rounded-lg w-full mx-auto mb-20">

          <h1 className={`text-2xl font-semibold mb-4 lg:text-3xl ${textColor}`}>Search</h1>

          <div className="relative mb-4">
            <div className="flex items-center space-x-2 mb-2">

              <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search walkers.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-2 border rounded-lg w-full pl-10"
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

                <button
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white p-2 rounded-lg md:p-3 lg:p-4"
              >
                Search
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>


          <div className="flex justify-between mb-4">

            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
              >
                <option value="">Distance</option>
                <option value="1km">Within 1km</option>
                <option value="2km">Within 2km</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2 mb-4 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 w-full">
              <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="bg-white border px-4 py-2 rounded-lg w-full md:w-1/4 lg:w-4/5"
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

          <div className="space-y-4 mt-4">
            {walkers.length > 0 ? (
                walkers.map((walker) => (
                    <div key={walker.id}
                         className="border rounded-lg p-4 flex items-center space-x-4 cursor-pointer bg-white"
                         onClick={() => handleWalkerClick(walker.id)}>

                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        {walker.profImgUrl && (
                            < img src={walker.profImgUrl} alt="User Profile Image" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">Walker Name: {`${walker.name} ${walker.surname}`}</p>
                        <p>Gender: {walker.gender}</p>
                        <p>Address: {walker.address}</p>
                        <p>Rating: ⭐ {walker.avgUserRating} / 5</p>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-center">No walkers found</p>
            )}
          </div>

        </div>
      </BackgroundLayout>
  );
}
