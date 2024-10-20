// pages/pre-meet-walker.js
"use client";

import {useState, useEffect} from 'react';
import {useRouter} from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function PreMeetWalker() {
    const router = useRouter();
    let walkerId = null;
    let token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
        walkerId = localStorage.getItem('userId');
        token = localStorage.getItem('token');
    }
    const [preMeet, setPreMeet] = useState([]);  // store pre meet list
    const [error, setError] = useState(null);    // store error message
    const textColor = useTextColor();

    useEffect(() => {
        handleSearch();  // Perform search for ALL pre-meet at first render
    }, [walkerId]);


    const handleSearch = async () => {
        setPreMeet([]); // Clear previous results
        setError(null); // Clear previous error messages

        const getPreMeetByWalkerIdAPI = `http://127.0.0.1:8080/preMeet/walker/${walkerId}`;

        try {
            const response = await fetch(getPreMeetByWalkerIdAPI, {
                method: 'get', // use get method
                credentials: 'include',  // Contains user credentials
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
                    router.push('/login');
                    return;
                }

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error fetching pre-meet');
                } else {
                    throw new Error('Unexpected non-JSON response');
                }
            }

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setPreMeet(data);  // save returned pre-meet list
                setError(null);    // clear error message
            } else {
                throw new Error('Invalid response type, expected JSON');
            }
        } catch (error) {
            console.error("Search pre-meet failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setPreMeet([]); // clear pre-meet list if error occur
        }
    };

    const handleBack = () => {
        router.push(`/home-walker`);  // route to walker home page
    };

    // formatting date and time
    const formatDateTime = (inputDateTime) => {
        const dateTime = new Date(inputDateTime);
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
        <div className="min-h-screen">
            <div className="p-4 rounded-lg mx-auto mt-4">
                {/* show back icon and title*/}
                <div className="flex items-center mb-4">
                    <button onClick={() => handleBack()} className={`mr-4 ${textColor}`}>
                        <svg
                            className={`w-6 h-6 text-black ${textColor}`}
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
                    <h1 className={`text-2xl ${textColor} font-semibold`}>Pre-Meet Details</h1>
                </div>

                {/* display content*/}
                {error && <p className="text-red-500">{error}</p>}

                {/* 显示返回的 pre-meet 列表 */}
                <div className="space-y-4 mt-4">
                    {preMeet.length > 0 ? (
                        preMeet.map((premeet) => (
                            <div key={premeet.preMeetId}
                                 className="border rounded-lg p-4 flex items-center space-x-4 cursor-pointer">

                                <div>
                                    <p><strong>You have a pre-meet request from {premeet.parentName}!</strong></p>
                                    <p><strong>Meeting Type:</strong> {premeet.preMeetType}</p>
                                    <p><strong>Meeting Time:</strong> {formatDateTime(premeet.time)}</p>
                                    <p><strong>Contact Info:</strong> {premeet.contactApproach}</p>
                                    <p><strong>Meeting URL/Address:</strong> {premeet.urlOrAddress}</p>
                                </div>

                                {/*<div className="ml-auto">*/}
                                {/*  <button className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>*/}
                                {/*</div>*/}
                            </div>
                        ))
                    ) : (
                        <p className={`text-center ${textColor}`}>No pre-meet request found</p>
                    )}
                </div>

            </div>
        </div>
        </BackgroundLayout>
    );
}
