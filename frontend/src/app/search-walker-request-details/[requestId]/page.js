// src/app/Search-Walker-request-information-details/page.js
"use client";

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function RequestDetails({params}) {
    const router = useRouter();
    const {requestId} = params;  // obtain dynamic route param
    const walkerId = localStorage.getItem('userId');
    const [requestDetails, setRequestDetails] = useState(null); // store request details
    const [error, setError] = useState(null);    // store error message
    const getRequestInfoAPI = `http://127.0.0.1:8080/WalkerRequest/getRequestDetailByRequestIdAndWalkerId/${requestId}/${walkerId}`;
    const applyRequestAPI = `http://127.0.0.1:8080/requests/${requestId}/apply?walkerId=${walkerId}`;

    // get request details info by request's id
    useEffect(() => {
        if (requestId) {
            fetchRequestDetails();
        }
        console.log(requestId, '---', walkerId);
    }, [requestId]);

    const fetchRequestDetails = async () => {
        try {
            const response = await fetch(getRequestInfoAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch request details');
            }

            const data = await response.json();
            setRequestDetails(data);  // store returned request info
        } catch (err) {
            setError(err.message);
        }
    };

    const applyRequest = async () => {
        try {
            const response = await fetch(applyRequestAPI, {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            console.log(response);

            if (response.status === 201) {
                // 成功响应，表示已经成功申请了 request
                const data = await response.json();
                alert('Request successfully applied!');
                // refresh page content
                fetchRequestDetails();
            } else if (response.status === 409) {
                // 409 冲突，表示已经申请过这个 request
                const errorData = await response.text();
                setError('You have already applied for this request.');
                alert('You have already applied for this request.');
            } else if (response.status === 404) {
                // 404 请求未找到
                const errorData = await response.text();
                setError(errorData);  // 显示请求未找到的错误信息
                alert('Request not found: ' + errorData);
            } else if (response.status === 400) {
                // 其他异常情况
                const errorData = await response.text();
                setError(errorData);  // 显示请求处理错误信息
                alert('An error occurred: ' + errorData);
            } else {
                // 处理未知的错误情况
                // throw new Error('Unexpected error occurred');
                const errorData = await response.text();
                setError(errorData);
                alert(errorData);
            }
        } catch (err) {
            setError(err.message);
            alert('Error: ' + err.message);
        }
    };

    const handleBack = () => {
        router.push(`/search-walker`);  // back to search requests page
    };

    const refreshPage = () => {
        router.push(`/search-walker-request-details/${requestId}`);  // back to search requests page
    };

    // format the start and end times
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

            return minutes > 0 ? `${hourText} and ${minuteText}` : hourText;
        }
    };

    // format publish date relative to the current time
    const timeSince = (publishDate) => {
        const now = new Date();
        const publishedDate = new Date(publishDate);
        // time difference in minutes
        const diffInMinutes = Math.floor((now - publishedDate) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `Published by ${diffInMinutes} minute(s) ago`;
        } else if (diffInMinutes < 1440) {
            return `Published by ${Math.floor(diffInMinutes / 60)} hour(s) ago`;
        } else {
            return `Published by ${Math.floor(diffInMinutes / 1440)} day(s) ago`;
        }
    };

    // render the content according to the type of the returned object(request/walkerRequest)
    const renderContent = () => {
        if (requestDetails) { // check if any object exist
            // Determine if we have a WalkerRequest or a Request
            if (requestDetails.request) { // only walkerRequest object contain walkerRequest.request attribute
                // this means walker has already applied this request
                // get walkerRequest object
                const walkerRequest = requestDetails;
                // extract request object from walkerRequest object
                const {request} = walkerRequest;

                const statusCheck = () => {
                    if (walkerRequest.status === 'Cancelled' || walkerRequest.status === 'Rejected') {
                        return <button
                            onClick={applyRequest}
                            className="bg-black text-white px-4 py-2 rounded-lg w-full">
                            Apply
                        </button>
                    } else if (walkerRequest.status === 'Applied') {
                        return <div className="mb-4">
                            <p className="text-yellow-600 text-lg">Your application has been sent</p>
                            <p className="text-yellow-600 text-lg">Waiting for response...</p>
                        </div>
                    } else {
                        return <p className="text-yellow-600">Your application status to this request is:
                            "{walkerRequest.status}"</p>
                    }
                }

                return (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <div className="mb-4">
                            <p className="text-gray-600">Parent Name:</p>
                            <p className="text-black text-lg">{request.parent.name}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Departure:</p>
                            <p className="text-black text-lg">{request.departure}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Destination:</p>
                            <p className="text-black text-lg">{request.destination}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Start Time:</p>
                            <p className="text-black text-lg">
                                {formatDateTime(request.startTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Arrive Time:</p>
                            <p className="text-black text-lg">
                                {formatDateTime(request.arriveTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Duration:</p>
                            <p className="text-black text-lg">
                                {getDuration(request.startTime, request.arriveTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Details:</p>
                            <p className="text-black text-lg">{request.details}</p>
                        </div>

                        <div className="mb-4 text-gray-500">
                            {timeSince(request.publishDate)}
                        </div>

                        {statusCheck()}
                    </div>
                );
            } else {
                // this means walker does not apply this request yet
                // get request object
                const request = requestDetails;

                return (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <div className="mb-4">
                            <p className="text-gray-600">Parent Name:</p>
                            <p className="text-black text-lg">{request.parent.name}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Departure:</p>
                            <p className="text-black text-lg">{request.departure}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Destination:</p>
                            <p className="text-black text-lg">{request.destination}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Start Time:</p>
                            <p className="text-black text-lg">
                                {formatDateTime(request.startTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Arrive Time:</p>
                            <p className="text-black text-lg">
                                {formatDateTime(request.arriveTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Duration:</p>
                            <p className="text-black text-lg">
                                {getDuration(request.startTime, request.arriveTime)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Details:</p>
                            <p className="text-black text-lg">{request.details}</p>
                        </div>

                        <div className="mb-4 text-gray-500">
                            {timeSince(request.publishDate)}
                        </div>

                        <button
                            onClick={applyRequest}
                            className="bg-black text-white px-4 py-2 rounded-lg w-full">
                            Apply
                        </button>
                    </div>
                );
            }
        }

        return <p>No request details found.</p>;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">

            <div className="bg-white p-4 shadow-md w-full max-w-md mx-auto">
                {/* show back icon and title*/}
                <div className="flex items-center mb-4">
                    <button onClick={() => handleBack()} className="mr-4">
                        <svg
                            className="w-6 h-6 text-black"
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
                    <h1 className="text-2xl font-semibold">Request details</h1>
                </div>

                {/* display content*/}
                {error && <p className="text-red-500">{error}</p>}
                {renderContent()}
                {/*<div className="p-4 bg-white rounded-lg shadow-md">*/}

                {/*  <div className="mb-4">*/}
                {/*    <p className="text-gray-600">Departure:</p>*/}
                {/*    <p className="text-black text-lg">Darling Harbour</p>*/}
                {/*  </div>*/}

                {/*  <div className="mb-4">*/}
                {/*    <p className="text-gray-600">Destination:</p>*/}
                {/*    <p className="text-black text-lg">Sydney Opera House</p>*/}
                {/*  </div>*/}

                {/*  <div className="mb-4">*/}
                {/*    <p className="text-gray-600">Estimated time:</p>*/}
                {/*    <p className="text-black text-lg">*/}
                {/*      8:00 AM Sun 11 Aug - 8:15 AM Sun 11 Aug*/}
                {/*    </p>*/}
                {/*  </div>*/}

                {/*  <div className="mb-4 text-gray-500">*/}
                {/*    Published by 1 hour ago*/}
                {/*  </div>*/}


                {/*  <button className="bg-black text-white px-4 py-2 rounded-lg w-full">*/}
                {/*    Apply*/}
                {/*  </button>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}