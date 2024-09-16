"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
const RequestStatusAccepted = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
            {/* Header */}
            <div className="bg-white w-full py-4 px-6 shadow flex items-center">
                <button onClick={() => router.back()} className="text-xl">
                    ←
                </button>
                <h1 className="text-center w-full text-xl font-semibold">My request</h1>
            </div>

            {/* Content */}
            <div className="bg-white shadow-md rounded-lg mt-6 p-6 w-11/12 max-w-lg border border-gray-300">
                <h2 className="text-xl font-semibold">Trip request</h2>
                <div className="mt-4">
                    <p><strong>Departure:</strong> Darling Harbour</p>
                    <p><strong>Destination:</strong> Sydney Opera House</p>
                    <p><strong>Estimated time:</strong> 8:00 AM Sun 11 Aug - 8:15 AM Sun 11 Aug</p>
                    <p className="text-gray-500 text-sm mt-2">Published by 1 hours ago</p>
                </div>
                <div className="mt-4 border-t pt-4">
                    <p className="text-green-600 font-semibold">Your application is accepted</p>
                </div>
                <div className="mt-4">
                    <button className="bg-black text-white py-2 px-4 rounded w-full text-center">
                        Cancel
                    </button>
                </div>
            </div>

            {/* Footer Navigation with custom PNG icons and text */}
            <div className="fixed bottom-0 w-full bg-white flex justify-between py-2 border-t shadow-md">
                <button onClick={() => router.push('/home')} className="flex-1 flex flex-col items-center text-center">
                    <Image src="/Navigation-icons/home.png" alt="Home" width={24} height={24} />
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button onClick={() => router.push('/search')} className="flex-1 flex flex-col items-center text-center">
                    <Image src="/Navigation-icons/lsearch.png" alt="Search" width={24} height={24} />
                    <span className="text-xs mt-1">Search</span>
                </button>
                <button onClick={() => router.push('/messages')} className="flex-1 flex flex-col items-center text-center">
                    <Image src="/Navigation-icons/envelope.png" alt="Messages" width={24} height={24} />
                    <span className="text-xs mt-1">Messages</span>
                </button>
                <button onClick={() => router.push('/request')} className="flex-1 flex flex-col items-center text-center">
                    <Image src="/Navigation-icons/request.png" alt="Request" width={24} height={24} />
                    <span className="text-xs mt-1">Request</span>
                </button>
                <button onClick={() => router.push('/profile')} className="flex-1 flex flex-col items-center text-center">
                    <Image src="/Navigation-icons/profile.png" alt="Profile" width={24} height={24} />
                    <span className="text-xs mt-1">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default RequestStatusAccepted;
