"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import moment from 'moment';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function AdminContentManagement() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const textColor = useTextColor();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fires every time the search box content changes
    useEffect(() => {
        if (searchTerm === '') {
            fetchAllRequests();  // When the search box is empty, get all requests
        }
    }, [searchTerm]);


    const handleClear = () => {
        setSearchTerm('');
    };


    const handleSearch = async () => {
        setLoading(true);  // Setting the loading state at the start of loading
        setRequests([]);
        setError(null);

        const searchRequestsAPI = `${apiUrl}/requests/searchRequests?searchTerm=${searchTerm}`;
        try {
            const response = await fetch(searchRequestsAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Please log in.');
                    router.push('/login');
                    return;
                }
                return response.json().then(data => {
                    setError(data.message);
                    throw new Error(data.message || "Error fetching requests");
                });
            }

            const data = await response.json();
            setRequests(data);
            setError(null);
        } catch (error) {
            console.error("Search requests failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Get all requests
    const fetchAllRequests = () => {
        setLoading(true);
        const getAllRequestsAPI = `${apiUrl}/requests/getAllRequests`;
        fetch(getAllRequestsAPI, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert('Please log in.');
                        router.push('/login');
                        return;
                    }
                    return response.json().then(data => {
                        setError(data.message);
                        throw new Error(data.message || "Error fetching requests");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched requests:', data);
                setRequests(data);
                setLoading(false);
                setError('');
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                setError('Failed to get requests. Please try again.');
            });
    };

    function deleteRequest(requestId) {
        console.log('requestId', requestId);
        fetch(`${apiUrl}/requests/${requestId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        alert(data.message);
                        throw new Error(data.message || "error deleting request");
                    });
                }
                alert('Request deleted successfully');
                fetchAllRequests();
            })
            .catch(err => {
                console.error(err);
                alert('Failed to delete request');
            });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Setting the style of the state
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Published':
                return 'text-green-500';  // green for published
            case 'Finished':
                return 'text-black';  // black for finished
            case 'In progress':
                return 'text-yellow-500';  // yellow for in progress
            case 'Accepted':
                return 'text-yellow-500';
            case 'Canceled':
                return 'text-red-500';  // red for canceled
            default:
                return 'text-gray-500';  // default grey
        }
    };

    // Display walker information (if present)
    const renderWalkerInfo = (walker) => {
        return walker ? `Assigned walker: ${walker.name}` : "No walker assigned";
    };

    return (
        <BackgroundLayout>
        <div className="min-h-screen px-2 mb-8">
                <button onClick={() => router.back()} className={`text-2xl p-2 focus:outline-none ${textColor}`}>
                    &larr;
                </button>
                 <h1 className={`text-2xl font-semibold ${textColor} mb-4`}>Admin Content Management</h1>


                <div className="space-y-4 mt-4">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : requests.length > 0 ? (
                        requests.map((request) => (
                            <div key={request.requestId} className="border rounded-lg p-4 flex items-center space-x-4 bg-white">
                                <div>
                                    <p><strong>Departure:</strong> {request.departure}</p>
                                    <p><strong>Destination:</strong> {request.destination}</p>
                                    <p><strong>Estimated
                                        Time:</strong> {moment(request.startTime).format("MM/DD/YYYY HH:mm")}</p>
                                    <p><strong>Arrive
                                        Time:</strong> {moment(request.arriveTime).format("MM/DD/YYYY HH:mm")}</p>
                                    <p className={`font-bold ${getStatusStyle(request.status)}`}>
                                        <strong>Status:</strong> {request.status}
                                    </p>
                                    <p>{renderWalkerInfo(request.walker)}</p>
                                </div>
                                <button
                                    onClick={() => deleteRequest(request.requestId)}
                                    className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                >
                                    delete
                                </button>
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
