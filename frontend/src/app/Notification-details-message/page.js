"use client";  // Add this at the very top of your file

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotificationDetailsMessage = () => {
  const router = useRouter();

  // Function to navigate to 'Notification-message' page when clicking the back button
  const handleBackClick = () => {
    router.push('/Notification-message');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={handleBackClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div></div> {/* Spacer to center the title */}
      </div>

      {/* Notification List */}
      <div className="p-4 space-y-4">
        <div className="p-4 bg-black text-white rounded-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m-3-8v2m0 0a9 9 0 11-7.485 3.725L6 12z"
            />
          </svg>
          <p className="flex-1">Your application has been received</p>
        </div>

        <div className="p-4 bg-black text-white rounded-lg">
          <p className="flex-1">
            Elise (parent/walker) has approved your application.
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
          <span className="text-right block mt-2">4:03 pm</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full border-t bg-white">
        <div className="flex justify-around p-2">
          <Link href="/home" className="flex flex-col items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-2 2V7a4 4 0 00-8 0v4"
              />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs">Search</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21.75 8.25v10.5A2.25 2.25 0 0119.5 21h-15a2.25 2.25 0 01-2.25-2.25V8.25m18 0A2.25 2.25 0 0019.5 6h-15A2.25 2.25 0 002.25 8.25m19.5 0L12 13.5 2.25 8.25"
              />
            </svg>
            <span className="text-xs font-bold">Messages</span>
          </Link>
          <Link href="/request" className="flex flex-col items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="text-xs">Request</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NotificationDetailsMessage;
