// src/app/Admin/UserManagement/UserDetail/page.js
"use client"; 

import { useRouter } from 'next/navigation';

export default function UserDetail() {
  const router = useRouter();

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

  
      <div className="flex items-start mb-6">
      
        <div className="w-24 h-24 bg-gray-200 rounded-lg border"></div>

      
        <div className="ml-6">
          <p className="text-lg font-semibold">ID: xxxxxxxxxxxx</p>
          <p className="text-lg">Role: Walker</p>
          <p className="text-lg">Rating: 1 stars</p>
        </div>
      </div>

 
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Feedback from Parents</h2>
        <div className="border rounded-lg p-4 h-32">
         
          <p>--------------------</p>
          <p>--------------------</p>
          <p>--------------------</p>
        </div>
      </div>

   
      <div className="flex justify-around mt-8">
        <button className="px-8 py-2 border-2 border-green-500 text-green-500 rounded-full">
          Active
        </button>
        <button className="px-8 py-2 border-2 border-red-500 text-red-500 rounded-full">
          Block
        </button>
      </div>
    </div>
  );
}
