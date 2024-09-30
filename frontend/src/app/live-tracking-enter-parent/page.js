"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LiveTrackingEnterWalker() {
    const router = useRouter();

    // 存储 trip request 数据
    const [tripData, setTripData] = useState({
        walker: '',
        departure: '',
        destination: '',
        estimatedTime: '',
    });


    useEffect(() => {
        async function fetchTripData() {
            // 从这个 API 获取数据
            const response = await fetch('/api/trip-data');
            const data = await response.json();

            // 更新 tripData
            setTripData({
                walker: data.walker,
                departure: data.departure,
                destination: data.destination,
                estimatedTime: data.estimatedTime,
            });
        }

        fetchTripData();
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">

            <div className="fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-black text-2xl">
                        <span>&lt;</span>
                    </button>
                    <h1 className="text-2xl font-bold">In progress</h1>
                </div>
            </div>

            <div className="flex flex-col justify-start w-full max-w-lg bg-white shadow-lg rounded-xl p-8 mt-20 min-h-[60vh]"> {/* Adjusted margin-top */}

                <div className="mt-25">
                    <h2 className="text-2xl font-bold">Trip request</h2>
                    <div className="mt-10 space-y-10">
                        <p className="text-lg">
                            <span className="font-bold">Parent:</span> {tripData.parent || 'Loading...'}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Departure:</span> {tripData.departure || 'Loading...'}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Destination:</span> {tripData.destination || 'Loading...'}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Estimated time:</span> {tripData.estimatedTime || 'Loading...'}
                        </p>
                    </div>
                </div>


                <div className="mt-40">
                    <button
                        onClick={() => alert('Live tracking started!')}
                        className="w-full bg-black text-white text-xl py-4 rounded-xl hover:bg-gray-800"
                    >
                        Live tracking
                    </button>
                </div>
            </div>
        </div>
    );
}
