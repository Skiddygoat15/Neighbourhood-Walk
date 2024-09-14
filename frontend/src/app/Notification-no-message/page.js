"use client";

import { useState } from "react";

export default function NotificationNoMessage() {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
      {/* Header */}
      <div className="w-full bg-white py-4 px-6 flex items-center justify-start shadow-sm">
        <button className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="text-black font-semibold text-xl">Notifications</div>
      </div>

      {/* Search Input */}
      <div className="w-full bg-white p-4 shadow-sm">
        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            className="bg-transparent flex-grow px-2 py-1 text-gray-600 focus:outline-none"
            type="text"
            placeholder="Search notifications.."
          />
        </div>
      </div>

            {/* Notification List */}
        <div className="flex-grow flex flex-col items-center justify-center text-center">
        {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-16 h-16 text-gray-400"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 8.25v10.5A2.25 2.25 0 0119.5 21h-15a2.25 2.25 0 01-2.25-2.25V8.25m18 0A2.25 2.25 0 0019.5 6h-15A2.25 2.25 0 002.25 8.25m19.5 0L12 13.5 2.25 8.25"
                />
            </svg>
            <p className="mt-4 text-black font-bold">Not notifications yet</p>
            <p className="text-gray-400">
                Your notifications will appear here once you've received them
            </p>
            </div>
        ) : (
            <ul className="list-disc">
            {notifications.map((notification, index) => (
                <li key={index} className="py-2">
                {notification}
                </li>
            ))}
            </ul>
        )}
        </div>


      {/* Bottom Navigation */}
      <div className="w-full bg-white py-2 shadow-inner flex justify-around items-center text-center">
        <a href="/home" className="text-gray-500 hover:text-black flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9.75V19.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 19.5V9.75M12 2.25L3 9.75m9-7.5l9 7.5M8.25 21V10.5h7.5V21"
            />
          </svg>
          <span className="text-xs">Home</span>
        </a>
        <a href="/search" className="text-gray-500 hover:text-black flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-xs">Search</span>
        </a>
        <a href="/messages" className="text-black flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 8.25v10.5A2.25 2.25 0 0119.5 21h-15a2.25 2.25 0 01-2.25-2.25V8.25m18 0A2.25 2.25 0 0019.5 6h-15A2.25 2.25 0 002.25 8.25m19.5 0L12 13.5 2.25 8.25"
            />
          </svg>
          <span className="text-xs">Messages</span>
        </a>
        <a href="/request" className="text-gray-500 hover:text-black flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="text-xs">Request</span>
        </a>
        <a href="/profile" className="text-gray-500 hover:text-black flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0"
            />
          </svg>
          <span className="text-xs">Profile</span>
        </a>
      </div>
    </div>
  );
}
