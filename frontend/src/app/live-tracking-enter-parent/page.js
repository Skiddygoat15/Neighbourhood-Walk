"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function LiveTrackingEnterParent() {
    const moment = require('moment');
    const textColor = useTextColor();
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        async function fetchRequests() {
            try {
                const parentId = sessionStorage.getItem('userId');
                const token = sessionStorage.getItem('token');

                if (!token || !parentId) {
                    console.error('No token or parentId found in sessionStorage');
                    return;
                }

                // get requests
                const response = await fetch(`${apiUrl}/requests/getRequestsByParentId/${parentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    console.error('Failed to fetch requests:', response.statusText);
                    return;
                }

                const data = await response.json();
                const sydneyNow = new Date();

                // Filter out requests with an Accepted status and a startTime within 35 hours of the current time.
                const filteredRequests = data.filter(request => {
                    const startTime = new Date(request.startTime);
                    const timeDiff = startTime.getTime() - sydneyNow.getTime();

                    return request.status === 'Accepted' && timeDiff <= 50 * 60 * 60 * 1000 && timeDiff >= 0;
                });

                // Iterate over filteredRequests and get the walker information for each request
                const requestsWithWalkerInfo = await Promise.all(filteredRequests.map(async (request) => {
                    const walkerResponse = await fetch(`${apiUrl}/requests/getWalkerByRequestId/${request.requestId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Get walker information using token
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!walkerResponse.ok) {
                        console.error(`Failed to fetch walker for request ${request.requestId}:`, walkerResponse.statusText);
                        return request; // If getting the walker fails, the original request is returned.
                    }

                    const walkerData = await walkerResponse.json();
                    return {
                        ...request,
                        walker: walkerData, // Add walker information to request
                    };
                }));

                setRequests(requestsWithWalkerInfo);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        }

        fetchRequests();
    }, []);

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

    // Jump function and store walkerId into sessionStorage
    const handleEnterLiveTracking = (requestId) => {
        router.push(`/live-tracking-sharing-parent/${requestId}`);
    }

    return (
        <BackgroundLayout>
        <div className="relative flex flex-col items-center justify-start min-h-screen p-8">
            <div className="fixed top-0 left-0 w-full p-4 z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className={`${textColor} text-2xl`}>
                        <span>&lt;</span>
                    </button>
                    <h1 className={`${textColor} text-2xl font-bold`}>In progress</h1>
                </div>
            </div>

            <div className="flex flex-col justify-start w-full max-w-lg bg-white shadow-lg rounded-xl p-8 mt-20 min-h-[60vh]">
                <h2 className="text-2xl font-bold">Upcoming Walk Requests</h2>
                {requests.length === 0 ? (
                    <p className="text-lg mt-10">No requests available within the next 35 hours.</p>
                ) : (
                    requests.map((request, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 mt-6 w-full" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                            <div className="space-y-4">
                                <p className="text-lg">
                                    <span className="font-bold">Walker:</span> {request.walker?.preferredName || request.walker?.name || 'Loading...'}
                                </p>
                                <p className="text-lg">
                                    <span className="font-bold">Departure:</span> {request.departure}
                                </p>
                                <p className="text-lg">
                                    <span className="font-bold">Destination:</span> {request.destination}
                                </p>
                                <p className="text-lg">
                                    <span className="font-bold">Departure Time:</span> {formatDateTime(request.startTime)}
                                </p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => handleEnterLiveTracking(request.requestId, request.walker.userId)} //pass requestId and walkerId
                                    className="w-full bg-black text-white text-xl py-4 rounded-xl hover:bg-gray-800"
                                >
                                    Enter Live Tracking
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
            </BackgroundLayout>
    );
}
