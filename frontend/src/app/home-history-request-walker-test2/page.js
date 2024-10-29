"use client";

import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";

export default function HistoryRequestParent() {
    const router = useRouter();
    const [requests,setRequests] = useState([]);
    const [comments,setComments] = useState([]);
    const userId = sessionStorage.getItem("userId");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleRateTrip = (requestId) => {
        router.push(`/live-tracking-comment-walker/${requestId}`);
    };

    useEffect(() => {
        getRequestsByWalkerId();
    }, []);

    useEffect(() => {
        requests.forEach(request => {
            getCommentByReuqestId(request.requestId); // Assuming each request has an 'id' field
            console.info("typeof request.requestId is",typeof request.requestId);
        });
    }, [requests]);

    useEffect(() => {
        console.info("requests are:",requests);
        console.info("comments are:",comments);
    }, [requests,comments]);

    function getRequestsByWalkerId(){
        fetch(`${apiUrl}/requests/getRequestsByWalkerId/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch requests');
                }
                return response.json();
            })
            .then(data =>{
                const completedRequests = data.filter(data => data.status === 'Completed');
                setRequests(completedRequests);
            })
            .catch(error => console.error('Error:', error));
    }

    function getCommentByReuqestId(requestId){
        if (comments.some(comment => comment.request?.requestId === requestId)) {
            return;
        }
        fetch(`${apiUrl}/Comment/getCommentsByReuqestId/${requestId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(data =>{
                console.info("data is",data)
                if (data){
                    const userId = parseInt(sessionStorage.getItem("userId"), 10);
                    const userComments = data.filter(comment => comment.userId === userId);
                    if (userComments.length > 0) {
                        setComments(prevComments => [...prevComments, ...userComments]);
                    }
                };
            })
            .catch(error => console.error('Error:', error));
    }

    // 计算 duration 的函数
    function calculateDuration(startTime, arriveTime) {
        if (!startTime || !arriveTime) return "N/A";
        const start = new Date(startTime);
        const arrive = new Date(arriveTime);
        const durationMs = arrive - start;
        const minutes = Math.floor(durationMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours > 0 ? `${hours}h ` : ''}${remainingMinutes}m`;
    }

    return (
        <main className="min-h-screen bg-white flex justify-center items-start pt-4">
            <div className="w-full max-w-md mx-auto p-4 space-y-8 overflow-auto" style={{ maxHeight: '90vh' }}>
                {/* 返回按钮 */}
                <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
                    &larr;
                </button>

                {/* 标题 */}
                <h1 className="text-2xl font-bold text-center">Request History</h1>

                <div className="space-y-4">
                    {requests.map((request, index) => {
                        const comment = comments.find(c => c.request?.requestId === request.requestId);
                        return (
                            <div key={index} className="border p-4 rounded-lg space-y-2">
                                {/* 显示请求的提供者信息 */}
                                <div className="flex justify-between">
                                    <span className="font-bold">{request.walker?.surname} Provided trip</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Start Time: {request.startTime ? new Date(request.startTime).toLocaleString() : "N/A"}
                                </p>
                                <p className="text-sm">Departure: {request.departure || "N/A"}</p>
                                <p className="text-sm">Destination: {request.destination || "N/A"}</p>

                                {/* 评论部分 */}
                                <div className="mt-2 flex items-center space-x-2">
                                    <h2 className="text-lg font-semibold">Comments：</h2>
                                    {comment ? (
                                        <p className="text-sm text-gray-700">{comment.comment}</p>
                                    ) : (
                                        <button
                                            onClick={() => handleRateTrip(request.requestId)}
                                            className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm">
                                            Comment
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">
                                        Duration: {calculateDuration(request.startTime, request.arriveTime)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
