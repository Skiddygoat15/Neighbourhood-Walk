"use client"
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -33.8688, // 经度
    lng: 151.2093, // 纬度
};

export default function LiveTrackingAfterEnter() {
    const router = useRouter();
    const [currentPosition, setCurrentPosition] = useState(center);

    // 获取当前位置
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100">

            <div className="absolute top-0 left-0 w-full p-4 bg-white shadow-md z-10 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-black text-2xl">
                        <span>&lt;</span>
                    </button>
                    <h1 className="text-2xl font-bold">Live-tracking</h1>
                </div>

                <div className="absolute bg-white p-3 rounded-full shadow" style={{ top: '80px', right: '20px' }}>
                    <Image
                        src="/Icon.png"
                        alt="Person icon"
                        width={30}
                        height={30}
                    />
                </div>
            </div>

            {/* Map Section */}
            <div className="w-full max-w-lg mt-40 flex justify-center">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={currentPosition}
                        zoom={14}
                    >

                        <Marker position={currentPosition} />
                    </GoogleMap>
                </LoadScript>
            </div>


            <div className="mt-auto mb-8 w-full max-w-lg px-8">
                <button
                    onClick={() => alert('Exit tracking')}
                    className="w-full bg-black text-white text-xl py-4 rounded-lg hover:bg-gray-800"
                >
                    Exit
                </button>
            </div>
        </div>
    );
}
