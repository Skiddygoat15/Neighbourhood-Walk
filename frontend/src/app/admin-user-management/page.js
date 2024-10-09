// src/app/Admin/UserManagement/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function AdminUserManagement() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 每次输入框内容变化时触发搜索
    useEffect(() => {
        if (searchTerm === '') {
            fetchUsers();  // 当搜索框为空时，获取所有用户
        }
    }, [searchTerm]);

    // 清除搜索内容
    const handleClear = () => {
        setSearchTerm('');
    };

    // 处理搜索功能
    const handleSearch = async () => {
        setLoading(true);  // 开始加载时设置 loading 状态
        setUsers([]);
        setError(null);

        const searchUsersAPI = `http://127.0.0.1:8080/Users/searchUsers?searchTerm=${searchTerm}`;
        try {
            const response = await fetch(searchUsersAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
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
                    throw new Error(data.message || "Error fetching users");
                });
            }

            const data = await response.json();
            setUsers(data);
            setError(null);  // 清空错误信息
        } catch (error) {
            console.error("Search users failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setUsers([]);
        } finally {
            setLoading(false);  // 请求结束后关闭 loading 状态
        }
    };

    // 获取所有用户
    const fetchUsers = () => {
        setLoading(true);
        const getAllUsersAPI = 'http://127.0.0.1:8080/Users/allUsers';
        fetch(getAllUsersAPI, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
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
                        throw new Error(data.message || "Error fetching users");
                    });
                }
                return response.json();
            })
            .then(async data => {
                // 并行获取每个用户的 roleType
                const usersWithRoles = await Promise.all(data.map(async (user) => {
                    const roleResponse = await fetch(`http://localhost:8080/roles/user/${user.id}`, {
                        method: 'get',
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!roleResponse.ok) {
                        throw new Error('Failed to fetch user role');
                    }

                    const roleData = await roleResponse.json();
                    //console.log('roleData:', roleData);
                    return {...user, role: roleData[0].roleType}; // 合并用户数据和角色类型
                }));
                console.log('Users with roles:', usersWithRoles);
                setUsers(usersWithRoles);
                setLoading(false);
                setError('');
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                setError('Failed to get users. Please try again.');
            });
    };

    // 键盘回车时触发搜索
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // set status css
    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-500';  // green for active
            case 'blocked':
                return 'text-red-500';  // red for blocked
            case 'offline':
                return 'text-gray-500';  // grey for offline
            default:
                return 'text-gray-500';  // default grey
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto mt-4">

                <h1 className="text-2xl font-semibold mb-4">Admin User Management</h1>

                <div className="relative mb-4">
                    <div className="flex items-center space-x-2 mb-2">

                        {/* input bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Users.."
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
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* search button */}
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white p-2 rounded-lg"
                        >
                            Search
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                </div>

                {/* return user list */}
                <div className="space-y-4 mt-4">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <div key={user.id} className="border rounded-lg p-4 flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                <div>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <p className={`font-bold ${getStatusStyle(user.activityStatus)}`}>
                                        <strong>Activity Status:</strong> {user.activityStatus}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No Users found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
