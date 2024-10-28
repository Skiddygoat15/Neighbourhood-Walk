"use client";

import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";

export default function HistoryRequestParent() {
    const router = useRouter();
    const [requests,setRequests] = useState([]);
    const [comments,setComments] = useState([]);
    const userId = sessionStorage.getItem("userId");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleRateTrip = () => {
        router.push('/home-rate-trip');
    };

    useEffect(() => {
        getRequestsByParentId();
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

    function getRequestsByParentId(){
        fetch(`http://${apiUrl}/requests/getRequestsByParentId/${userId}`, {
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
                setRequests(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function getCommentByReuqestId(requestId){
        if (comments.some(comment => comment.request?.requestId === requestId)) {
            return;
        }
        fetch(`http://${apiUrl}/Comment/getCommentByReuqestId/${requestId}`, {
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
                if (data){
                    setComments([...comments, data])
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

                {/* 仅显示有评论的请求 */}
                <div className="space-y-4">
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-2">
                                {/* 显示请求的提供者信息 */}
                                <div className="flex justify-between">
                                    <span className="font-bold">{comment.request?.walker?.surname} Provided trip</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Start Time: {comment.request?.startTime ? new Date(comment.request.startTime).toLocaleString() : "N/A"}
                                </p>
                                <p className="text-sm">Departure: {comment.request?.departure || "N/A"}</p>
                                <p className="text-sm">Destination: {comment.request?.destination || "N/A"}</p>

                                {/* 评论部分 */}
                                <div className="mt-2">
                                    <h2 className="text-lg font-semibold">Comments：</h2>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button onClick={handleRateTrip}
                                            className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm">Comment
                                    </button>
                                    <p className="text-sm text-gray-500">
                                        Duration: {calculateDuration(comment.request?.startTime, comment.request?.arriveTime)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No Comment Yet</p>
                    )}
                </div>
            </div>
        </main>
    );
    // return (
    //     <main className="min-h-screen bg-white">
    //         <div className="max-w-md mx-auto p-4 space-y-8">
    //             {/* 返回按钮 */}
    //             <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
    //                 &larr;
    //             </button>
    //
    //             {/* 标题 */}
    //             <h1 className="text-2xl font-bold text-center">History Request</h1>
    //
    //             {/* 历史请求项 */}
    //             <div className="space-y-4">
    //                 {requests.map((request, index) => (
    //                     <div key={index} className="border p-4 rounded-lg space-y-2">
    //                         <div className="flex justify-between">
    //                             <span className="font-bold">{request.providerName} Provided trip</span>
    //                         </div>
    //                         <p className="text-gray-600 text-sm">{request.startTime}</p>
    //                         <p className="text-sm">{request.departure}</p>
    //                         <p className="text-sm">{request.destination}</p>
    //
    //                         {/* 评论部分 */}
    //                         <div className="mt-2">
    //                             <h2 className="text-lg font-semibold">Comment：</h2>
    //                             {comments[request.requestId] ? (
    //                                 comments[request.requestId].map((comment, commentIndex) => (
    //                                     <p key={commentIndex} className="text-sm text-gray-700">
    //                                         {comment.content}
    //                                     </p>
    //                                 ))
    //                             ) : (
    //                                 <p className="text-sm text-gray-500">No Comment</p>
    //                             )}
    //                         </div>
    //
    //                         <div className="flex justify-between items-center">
    //                             <button onClick={handleRateTrip} className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm">Comment</button>
    //                             <p className="text-sm text-gray-500">{request.duration}</p>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </main>
    // );
    // return (
    //     <main className="min-h-screen bg-white">
    //         <div className="max-w-md mx-auto p-4 space-y-8">
    //             {/* Back Button */}
    //             <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
    //                 &larr;
    //             </button>
    //
    //             {/* Title */}
    //             <h1 className="text-2xl font-bold text-center">History Request</h1>
    //
    //             {/* History Items */}
    //             <div className="space-y-4">
    //                 {/* First Item */}
    //                 <div className="border p-4 rounded-lg space-y-2">
    //                     <div className="flex justify-between">
    //                         <span className="font-bold">Lily provide the trip</span>
    //                         <button className="text-lg">
    //                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
    //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.1 0 2-.9 2-2V7m-4 2c0 1.1.9 2 2 2zm0 0c1.1 0 2 .9 2 2v1m-4-3c0 1.1-.9 2-2 2v1m-4-1c1.1 0 2-.9 2-2zm10 5c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-7c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2m4-9c1.1 0 2 .9 2 2v1m-4-2c0 1.1-.9 2-2 2z" />
    //                             </svg>
    //                         </button>
    //                     </div>
    //                     <p className="text-gray-600 text-sm">01/08/2024 4:25PM</p>
    //                     <p className="text-sm">234 Sussex St, Sydney NSW 2000</p>
    //                     <p className="text-sm">356 Crown St, Surry Hills NSW 2010</p>
    //                     <div className="flex justify-between items-center">
    //                         <button onClick={handleRateTrip} className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm">Rate</button>
    //                         <p className="text-sm text-gray-500">4:28 PM - 4:42 PM</p>
    //                     </div>
    //                 </div>
    //
    //                 {/* Additional Items */}
    //                 {/* Add similar blocks for other items, modifying the onClick of the Rate button as needed */}
    //
    //             </div>
    //         </div>
    //     </main>
    // );
}
