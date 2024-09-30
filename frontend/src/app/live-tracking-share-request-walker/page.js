"use client"
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const containerStyle = {
    width: '100%',
    height: '400px',
};


const center = {
    lat: -33.8688, // 纬度
    lng: 151.2093, // 经度
};

export default function LiveTrackingShareRequestWalker() {
    const router = useRouter();
    const [locationAccepted, setLocationAccepted] = useState(false);

    const handleAccept = () => {
        setLocationAccepted(true);
        alert('Location sharing accepted');
    };

    const handleReject = () => {
        alert('Location sharing rejected');
    };

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
            <div className="fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-black text-2xl">
                        <span>&lt;</span>
                    </button>
                    <h1 className="text-2xl font-bold">Live-tracking-request</h1>
                </div>
            </div>


            <div className="w-full max-w-lg mt-20 flex justify-center">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"> {/* 替换为你的 API Key */}
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={14}
                    >

                        <Marker position={center} />
                    </GoogleMap>
                </LoadScript>
            </div>


            <div className="mt-20 text-center">
                <p className="text-lg">Parent wants to share your location...</p>
            </div>


            <div className="flex space-x-4 mt-40">
                <button
                    onClick={handleAccept}
                    className="w-32 bg-black text-white text-lg py-2 rounded-lg"
                >
                    Accept
                </button>
                <button
                    onClick={handleReject}
                    className="w-32 bg-gray-300 text-gray-700 text-lg py-2 rounded-lg"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
