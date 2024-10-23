// src/app/Admin/UserManagement/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function AdminUserManagement() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const textColor = useTextColor();

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
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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

    // 激活用户
    const handleActivate = async (userId) => {
        const activateUserAPI = `http://127.0.0.1:8080/Users/activeUser/${userId}`;
        try {
            const response = await fetch(activateUserAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();  // 更新用户列表
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to activate user.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // 封锁用户
    const handleBlock = async (userId) => {
        const blockUserAPI = `http://127.0.0.1:8080/Users/blockUser/${userId}`;
        try {
            const response = await fetch(blockUserAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();  // 更新用户列表
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to block user.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // 删除用户
    const handleDelete = async (userId) => {
        const deleteUserAPI = `http://127.0.0.1:8080/Users/${userId}`;
        try {
            const response = await fetch(deleteUserAPI, {
                method: 'delete',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();  // 更新用户列表
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to delete user.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // set status css
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-500';  // green for active
            case 'Blocked':
                return 'text-red-500';  // red for blocked
            case 'Offline':
                return 'text-gray-500';  // grey for offline
            default:
                return 'text-gray-500';  // default grey
        }
    };

    return (
        <BackgroundLayout>
        <div className="min-h-screen px-2 mb-8">
                {/* Back Button */}
                <button onClick={() => router.back()} className={`text-2xl p-2 focus:outline-none ${textColor}`}>
                    &larr;
                </button>
                <h1 className={`text-2xl font-semibold ${textColor} mb-4`}>Admin User Management</h1>

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
                            <div key={user.id}
                                 className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">
                                {/* User Details */}
                                <div className="flex-grow ml-4">
                                    <p className="text-lg font-semibold text-gray-700">
                                        <strong>Name:</strong> {user.name}</p>
                                    <p className="text-sm text-gray-500"><strong>ID:</strong> {user.id}</p>
                                    <p className="text-sm text-gray-500"><strong>Role:</strong> {user.role}</p>
                                    <p className={`font-semibold ${getStatusStyle(user.activityStatus)} text-sm`}>
                                        <strong>Activity Status:</strong> {user.activityStatus}
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col space-y-2">
                                    {/* Activate Button */}
                                    <button
                                        onClick={() => handleActivate(user.id)}
                                        className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                    >
                                        Activate
                                    </button>

                                    {/* Block Button */}
                                    <button
                                        onClick={() => handleBlock(user.id)}
                                        className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                    >
                                        Block
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                        ))
                    ) : (
                        <p className="text-center">No Users found</p>
                    )}
                </div>
            </div>
    </BackgroundLayout>
    );
}
