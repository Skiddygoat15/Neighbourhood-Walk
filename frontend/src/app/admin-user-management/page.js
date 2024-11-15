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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    useEffect(() => {
        if (searchTerm === '') {
            fetchUsers();
        }
    }, [searchTerm]);


    const handleClear = () => {
        setSearchTerm('');
    };


    const handleSearch = async () => {
        setLoading(true);
        setUsers([]);
        setError(null);

        const searchUsersAPI = `${apiUrl}/Users/searchUsers?searchTerm=${searchTerm}`;
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
            setError(null);
        } catch (error) {
            console.error("Search users failed:", error);
            setError(error.message || 'An unknown error occurred.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };


    const fetchUsers = () => {
        setLoading(true);
        const getAllUsersAPI = `${apiUrl}/Users/allUsers`;
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
                const usersWithRoles = await Promise.all(data.map(async (user) => {
                    const roleResponse = await fetch(`${apiUrl}/roles/user/${user.id}`, {
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
                    return {...user, role: roleData[0].roleType}; // Merge user data and role types
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


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    const handleActivate = async (userId) => {
        const activateUserAPI = `${apiUrl}/Users/activeUser/${userId}`;
        try {
            const response = await fetch(activateUserAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();
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
        const blockUserAPI = `${apiUrl}/Users/blockUser/${userId}`;
        try {
            const response = await fetch(blockUserAPI, {
                method: 'get',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to block user.');
            }
        } catch (error) {
            setError(error.message);
        }
    };


    const handleDelete = async (userId) => {
        const deleteUserAPI = `${apiUrl}/Users/${userId}`;
        try {
            const response = await fetch(deleteUserAPI, {
                method: 'delete',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            if (response.ok) {
                fetchUsers();
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
                <button onClick={() => router.back()} className={`text-2xl p-2 focus:outline-none ${textColor}`}>
                    &larr;
                </button>
                <h1 className={`text-2xl font-semibold ${textColor} mb-4`}>Admin User Management</h1>

                {/*<div className="relative mb-4">*/}
                {/*    <div className="flex items-center space-x-2 mb-2">*/}

                {/*        <div className="relative w-full">*/}
                {/*            <input*/}
                {/*                type="text"*/}
                {/*                placeholder="Search Users.."*/}
                {/*                value={searchTerm}*/}
                {/*                onChange={(e) => setSearchTerm(e.target.value)}*/}
                {/*                onKeyDown={handleKeyDown}*/}
                {/*                className="flex-grow p-2 border rounded-lg w-full pl-10"*/}
                {/*            />*/}

                {/*            <svg*/}
                {/*                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"*/}
                {/*                fill="none"*/}
                {/*                stroke="currentColor"*/}
                {/*                viewBox="0 0 24 24"*/}
                {/*                xmlns="http://www.w3.org/2000/svg"*/}
                {/*            >*/}
                {/*                <path*/}
                {/*                    strokeLinecap="round"*/}
                {/*                    strokeLinejoin="round"*/}
                {/*                    strokeWidth="2"*/}
                {/*                    d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"*/}
                {/*                />*/}
                {/*            </svg>*/}

                {/*            <button*/}
                {/*                onClick={handleClear}*/}
                {/*                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"*/}
                {/*            >*/}
                {/*                ✕*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*        <button*/}
                {/*            onClick={handleSearch}*/}
                {/*            className="bg-blue-500 text-white p-2 rounded-lg"*/}
                {/*        >*/}
                {/*            Search*/}
                {/*        </button>*/}
                {/*    </div>*/}

                {/*    {error && <p className="text-red-500">{error}</p>}*/}
                {/*</div>*/}

                <div className="space-y-4 mt-4">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <div key={user.id}
                                 className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">

                                <div className="flex-grow ml-4">
                                    <p className="text-lg font-semibold text-gray-700">
                                        <strong>Name:</strong> {user.name}</p>
                                    <p className="text-sm text-gray-500"><strong>ID:</strong> {user.id}</p>
                                    <p className="text-sm text-gray-500"><strong>Role:</strong> {user.role}</p>
                                    <p className={`font-semibold ${getStatusStyle(user.activityStatus)} text-sm`}>
                                        <strong>Activity Status:</strong> {user.activityStatus}
                                    </p>
                                </div>


                                <div className="flex flex-col space-y-2">

                                    <button
                                        onClick={() => handleActivate(user.id)}
                                        className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                    >
                                        Activate
                                    </button>

                                    <button
                                        onClick={() => handleBlock(user.id)}
                                        className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm transition-all duration-150 w-24 text-center"
                                    >
                                        Block
                                    </button>

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
