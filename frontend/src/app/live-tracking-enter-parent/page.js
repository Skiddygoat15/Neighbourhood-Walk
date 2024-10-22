"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LiveTrackingEnterParent() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        async function fetchRequests() {
            try {
                const parentId = localStorage.getItem('userId'); // 从localStorage获取parentId
                const token = localStorage.getItem('token'); // 从localStorage获取token

                if (!token || !parentId) {
                    console.error('No token or parentId found in localStorage');
                    return;
                }

                // 获取requests
                const response = await fetch(`http://127.0.0.1:8080/requests/getRequestsByParentId/${parentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // 添加token到请求头
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    console.error('Failed to fetch requests:', response.statusText);
                    return;
                }

                const data = await response.json();
                const sydneyNow = new Date();

                // 过滤出Accepted状态并且startTime距离当前时间35小时以内的请求
                const filteredRequests = data.filter(request => {
                    const startTime = new Date(request.startTime);
                    const timeDiff = startTime.getTime() - sydneyNow.getTime();

                    return request.status === 'Accepted' && timeDiff <= 50 * 60 * 60 * 1000 && timeDiff >= 0;
                });

                // 遍历filteredRequests并获取每个request的walker信息
                const requestsWithWalkerInfo = await Promise.all(filteredRequests.map(async (request) => {
                    const walkerResponse = await fetch(`http://127.0.0.1:8080/requests/getWalkerByRequestId/${request.requestId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // 使用token获取walker信息
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!walkerResponse.ok) {
                        console.error(`Failed to fetch walker for request ${request.requestId}:`, walkerResponse.statusText);
                        return request; // 如果获取walker失败，返回原始request
                    }

                    const walkerData = await walkerResponse.json();
                    return {
                        ...request,
                        walker: walkerData, // 将walker信息加入request
                    };
                }));

                setRequests(requestsWithWalkerInfo);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        }

        fetchRequests();
    }, []);

    // 跳转函数并将walkerId存入LocalStorage
    const handleEnterLiveTracking = (requestId) => {
        router.push(`/live-tracking-sharing-parent/${requestId}`);
    }

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
            <div className="fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-black text-2xl">
                        <span>&lt;</span>
                    </button>
                    <h1 className="text-2xl font-bold">In progress</h1>
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
                                    <span className="font-bold">Departure Time:</span> {new Date(request.startTime).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
                                </p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => handleEnterLiveTracking(request.requestId, request.walker.userId)} // 将requestId和walkerId传递
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
    );
}
