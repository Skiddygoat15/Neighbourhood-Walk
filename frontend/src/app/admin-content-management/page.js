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

    // 每次搜索框内容变化时触发
    useEffect(() => {
        if (searchTerm === '') {
            fetchAllRequests();  // 当搜索框为空时，获取所有请求
        }
    }, [searchTerm]);

    // 清除搜索内容
    const handleClear = () => {
        setSearchTerm('');
    };

    // 处理搜索功能
    const handleSearch = async () => {
        setLoading(true);  // 开始加载时设置 loading 状态
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
            setError(null);  // 清空错误信息
        } catch (error) {
            console.error("Search requests failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setRequests([]);
        } finally {
            setLoading(false);  // 请求结束后关闭 loading 状态
        }
    };

    // 获取所有请求
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
            method: 'DELETE', // DELETE 方法用于删除请求
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 JSON 类型
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
                // 成功删除后，你可以刷新请求列表
                fetchAllRequests();
            })
            .catch(err => {
                console.error(err);
                alert('Failed to delete request');
            });
    }

    // 键盘回车时触发搜索
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 设置状态的样式
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

    // 显示 walker 的信息（如果存在）
    const renderWalkerInfo = (walker) => {
        return walker ? `Assigned walker: ${walker.name}` : "No walker assigned";
    };

    return (
        <BackgroundLayout>
        <div className="min-h-screen px-2 mb-8">
             {/*<div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-4">*/}
                {/* Back Button */}
                <button onClick={() => router.back()} className={`text-2xl p-2 focus:outline-none ${textColor}`}>
                    &larr;
                </button>
                 <h1 className={`text-2xl font-semibold ${textColor} mb-4`}>Admin Content Management</h1>
                <div className="relative mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        {/* input bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Requests..."
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
                            {/* clear button */}
                            <button
                                onClick={handleClear}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white p-2 rounded-lg">
                            Search
                        </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>

                {/* 显示请求列表 */}
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
