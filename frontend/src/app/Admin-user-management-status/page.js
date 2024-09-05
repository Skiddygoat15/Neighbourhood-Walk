// src/app/Admin/UserManagement/page.js
"use client"; 

import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const router = useRouter();

  const users = [
    { id: 'xxxxxxxxxx', role: 'Walker', status: 'Active', statusColor: 'bg-green-500' },
    { id: 'xxxxxxxxxx', role: 'Walker', status: 'Blocked', statusColor: 'bg-red-500' },
    { id: 'xxxxxxxxxx', role: 'Walker', status: 'Offline', statusColor: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
 
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()} className="mr-4">
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
        <h1 className="text-2xl font-semibold">User management</h1>
      </div>

 
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users.."
          className="w-full p-2 border rounded-lg pl-10"
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
      </div>

  
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
 
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>

       
            <div>
              <p className="font-semibold">ID: {user.id}</p>
              <p>Role: {user.role}</p>
              <p className="flex items-center">
                {user.status}
                <span className={`ml-2 h-3 w-3 rounded-full ${user.statusColor}`} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
