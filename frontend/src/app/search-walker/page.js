// pages/Search-Walker.js
"use client";

import {useState, useEffect} from 'react';
import {useRouter} from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function SearchWalker() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const router = useRouter();
    let walkerId = null;
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
        walkerId = sessionStorage.getItem('userId');
        token = sessionStorage.getItem('token');
    }
    const [distance, setDistance] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState([]);  // store requests list
    const [error, setError] = useState(null);    // store error message
    const textColor = useTextColor();

    useEffect(() => {
        if (searchTerm === '') {
            handleSearch();  // Perform search for ALL Request when input box clear
        }
    }, [searchTerm, distance]);

    const handleClear = () => {
        setSearchTerm('');
        setDistance('');
    }; // empty searchTerm and all filters

    const handleSearch = async () => {
        setRequests([]); // Clear previous results when clicking the search button.
        setError(null); // Clear the previous error message

        const searchRequestsAPI = `${apiUrl}/requests/searchRequests?walkerId=${walkerId}&searchTerm=${searchTerm}&distance=${distance}`;

        try {
            const response = await fetch(searchRequestsAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(response);

            // Check if the Content-Type of the response is application/json
            const contentType = response.headers.get('Content-Type');
            if (!response.ok) {
                if (response.status === 403) {
                    alert('Please log in.');
                    router.push('/registration-loginform');
                    return;
                }

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error fetching Requests');
                } else {
                    throw new Error('Unexpected non-JSON response');
                }
            }

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setRequests(data); // Save the list of requests returned
                setError(null); // Clear the error message
            } else {
                throw new Error('Invalid response type, expected JSON');
            }
        } catch (error) {
            console.error("Search requests failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setRequests([]); // If something goes wrong, clear the request list.
        }

    };

    // perform search when press Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleRequestClick = (id) => {
        router.push(`/search-walker-request-details/${id}`);  // route to request details page with request id
    };

    // formatting date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0, so add 1.
        const day = String(date.getDate()).padStart(2, '0'); // Completing two-digit numbers with zeros
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes} - ${day}/${month}/${year}`;  // return format hh-mm dd/mm/yyyy
    };

    // calculate time difference between start and arrive
    const getDuration = (startTime, arriveTime) => {
        const startDate = new Date(startTime);
        const arriveDate = new Date(arriveTime);

        // time difference in minutes
        const diffInMinutes = Math.floor((arriveDate - startDate) / (1000 * 60));

        if (diffInMinutes === 1) {
            return `1 Minute`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} Minutes`;
        } else {
            const hours = Math.floor(diffInMinutes / 60); // calculate hours
            const minutes = diffInMinutes % 60; // calculate remaining minutes
            const hourText = hours === 1 ? '1 Hour' : `${hours} Hours`;
            const minuteText = minutes === 1 ? '1 Minute' : `${minutes} Minutes`;

            return minutes > 0 ? `${hourText} ${minuteText}` : hourText;
        }
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
                                placeholder="Search Requests.."
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
                            className="bg-blue-500 text-white p-2 rounded-lg"
                        >
                            Search
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
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

                <div className="space-y-4 mt-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request.requestId}
                                 className="border rounded-lg p-4 flex items-center space-x-4 cursor-pointer bg-white"
                                 onClick={() => handleRequestClick(request.requestId)}>

                                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                    {request.parent.profImgUrl && (
                                        < img src={request.parent.profImgUrl} alt="User Profile Image" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p><strong>Parent Name:</strong> {request.parent.name}</p>
                                    <p><strong>From:</strong> {request.departure}</p>
                                    <p><strong>To:</strong> {request.destination}</p>
                                    <p><strong>Start Time:</strong> {formatDateTime(request.startTime)}</p>
                                    <p><strong>Duration:</strong> {getDuration(request.startTime, request.arriveTime)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No Requests found</p>
                    )}
                </div>

            </div>
        </BackgroundLayout>
    );
}
