"use client";

import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";

export default function HistoryRequestParent() {
    const router = useRouter();
    const [requests,setRequests] = useState([]);
    const [walkerComments,setWalkerComments] = useState([]);
    const [parentComments,setParentComments] = useState([]);
    const userId = sessionStorage.getItem("userId");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [commentUpdated, setCommentUpdated] = useState(false);

    const handleRateTrip = (requestId) => {
        router.push(`/live-tracking-comment-walker/${requestId}`);
        setCommentUpdated(prev => !prev); // 切换commentUpdated状态，触发useEffect
    };
    useEffect(() => {

        requests.forEach(request => {
            console.info("userId is1:",userId)
            getCommentByReuqestId(request.requestId, userId);
        });
    }, [commentUpdated]);
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
        console.info("walkerComments are:",walkerComments);
        console.info("parentComments are:",parentComments);
    }, [requests,walkerComments,parentComments]);

    function getRequestsByParentId(){
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

    //********************这里需要改成对此request判断parent是否已经评价********************
    function getCommentByReuqestId(requestId, userId){
        console.info("userId is2:",userId)
        const localUserId = parseInt(sessionStorage.getItem("userId"), 10);
        if (parentComments.some(comment => comment.request?.requestId === requestId)) {
            return;
        }
        if (walkerComments.some(comment => comment.request?.requestId === requestId)) {
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
                console.info("data is", data)
                if (data){

                    const parentCommentsGet = data.filter(comment => comment.userId !== localUserId);
                    const walkerCommentsGet = data.filter(comment => {
                        console.info("walkerCommentsGet：comment.userId:", comment.userId); // 检查每个 comment 对象的 userId
                        console.info("localUserId:", localUserId); // 确保 localUserId 是定义且正确的
                        console.info(typeof comment.userId); // 检查每个 comment 对象的 userId
                        console.info(typeof localUserId); // 确保 localUserId 是定义且正确的
                        return comment.userId === localUserId;
                    });
                    console.info("walkerCommentsGet is",walkerCommentsGet)
                    console.info("parentCommentsGet is",parentCommentsGet)
                    if (parentCommentsGet.length > 0) {
                        setParentComments(prevComments => [...prevComments, ...parentCommentsGet]);
                    }
                    if (walkerCommentsGet.length > 0) {
                        setWalkerComments(prevComments => [...prevComments, ...walkerCommentsGet]);
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
                        const walkerComment = walkerComments.find(c => c.request?.requestId === request.requestId);
                        const parentComment = parentComments.find(c => c.request?.requestId === request.requestId);
                        console.info("walkerComment finally is:",walkerComment)
                        console.info("parentComment finally is:",parentComment)
                        return (
                            <div key={index} className="border p-4 rounded-lg space-y-2">
                                {/* 显示请求的提供者信息 */}
                                <div className="flex justify-between">
                                    <span className="font-bold">{request.walker?.surname} Provided trip</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Start
                                    Time: {request.startTime ? new Date(request.startTime).toLocaleString() : "N/A"}
                                </p>
                                <p className="text-sm">Departure: {request.departure || "N/A"}</p>
                                <p className="text-sm">Destination: {request.destination || "N/A"}</p>

                                {/* 评论部分 */}
                                <div className="mt-2 flex items-center space-x-2">
                                    <h2 className="text-lg font-semibold">Comments：</h2>
                                    {walkerComment ? (
                                        <p className="text-sm text-gray-700">{walkerComment.comment}</p>
                                    ) : (
                                        <p className="text-sm text-gray-700">Parent has not commented you yet</p>
                                    )}
                                </div>

                                <div className="mt-2 flex items-center space-x-2">
                                    {parentComment ? (
                                        <p className="text-sm text-gray-700"></p>
                                    ) : (
                                        <button
                                            onClick={() => handleRateTrip(request.requestId)}
                                            className="mt-2 py-1 px-4 text-white bg-black rounded-full text-sm block"> {/* 使用 block 样式 */}
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
