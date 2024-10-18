"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

const RequestStatus = () => {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const walkerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const textColor = useTextColor();


        useEffect(() => {

            if (!walkerId || !token) {
                alert('please login');
                router.push('/Login');
                return;
            }

        const getRequestsListAPI = `http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${walkerId}`;

        fetch(getRequestsListAPI, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert('please login');
                        router.push('/Login');
                        return null;
                    }
                    return response.json().then(data => {
                        alert(data.message);
                        setError(data.message || "fetch request list failed");
                        throw new Error(data.message || "error getting request list");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    console.log("fetch request list successful", data);
                    setRequests(data);
                    setError('');
                }
            })
            .catch(err => {
                console.error("fail to fetch:", err);
                setError('fail to fetch, please try again');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [walkerId, token, router]);

    const renderStatusMessage = (status) => {
        console.log("current status:" + status);
        switch (status) {
            case "Finished":
                return <p className="text-yellow-600 font-semibold">The request has been finished</p>;
            case "Applied":
                return <p className="text-red-600 font-semibold">Waiting respond...</p>;
            case "Rejected":
                return <p className="text-red-600 font-semibold">Your application is rejected</p>;
            case "Accepted":
                return <p className="text-green-600 font-semibold">Your application is accepted</p>;
            default:
                return <p className="text-gray-600">Your application is {status}</p>;
        }
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
            <div className="min-h-screen flex flex-col items-center justify-start">

                <button
                    onClick={() => router.back()}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${textColor}`}
                    style={{ position: 'absolute', left: '20px', top: '20px' }}
                >
                    ←
                </button>

                {/* Header */}
                <div className="max-w-lg w-11/12 rounded-lg py-4 flex items-center mt-4 mx-auto">
                    <h1 className={`text-center w-full text-xl font-semibold ${textColor}`}>My Request</h1>
                </div>


                {/* Content */}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : requests.length > 0 ? (
                    requests.map((request, index) => (
                        <div key={index}
                             className="bg-white shadow-md rounded-lg mt-6 p-4 w-11/12 max-w-lg">
                            <h2 className={`text-xl font-semibold ${textColor}`}>Trip request</h2>
                            <div className="mt-4">
                                <p><strong>Departure:</strong> {request.request.departure}</p>
                                <p><strong>Destination:</strong> {request.request.destination}</p>
                                <p><strong>Start time:</strong> {formatDateTime(request.request.startTime)}</p>
                                <p><strong>Arrive time:</strong> {formatDateTime(request.request.arriveTime)}</p>
                                <p className="text-gray-500 text-sm mt-2">Published
                                    by {formatDateTime(request.request.publishDate)}</p>
                            </div>
                            <div className="mt-4 border-t pt-4">
                                {/* Status Display */}
                                {renderStatusMessage(request.status)}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={`${textColor}`}>You haven't apply a walk Request</p>
                )}
            </div>
        </BackgroundLayout>
    );
};

export default RequestStatus;
