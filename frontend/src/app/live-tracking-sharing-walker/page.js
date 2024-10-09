"use client"
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';


const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -33.8688, // 纬度
    lng: 151.2093, // 经度
};

export default function LiveTrackingSharingWalker() {
    const router = useRouter();

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
            <div className="fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-black text-2xl">
                        <span>&lt;</span>
                    </button>
                    <h1 className="text-2xl font-bold">Live-tracking</h1>
                </div>
            </div>

            <div className="mt-20 text-center">
                <p className="text-lg">
                    You are sharing your location with{' '}
                    <span className="text-green-600 font-bold">your parent</span>
                </p>
            </div>

            <div className="w-full max-w-lg mt-6 flex justify-center">
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
