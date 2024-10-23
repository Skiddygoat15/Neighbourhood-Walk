"use client"
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {useState, useEffect, useCallback, useRef} from 'react';
import Image from 'next/image';

const containerStyle = {
    width: '100%',
    height: '530px',
};

const center = {
    lat: -33.8688, // longitude
    lng: 151.2093, // latitude
};

export default function LiveTrackingAfterEnter() {
    const router = useRouter();
    const [currentPosition, setCurrentPosition] = useState(null); // Initially null, waiting to get the current location
    const [map, setMap] = useState(null);
    const isButtonAdded = useRef(false);  // Used to track whether a button has been added

    // Get current location
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = {
                        lat: latitude,
                        lng: longitude,
                    };
                    setCurrentPosition(newPosition);
                    if (map) {
                        map.panTo(newPosition);
                    }
                },
                (error) => console.error("Error getting location: ", error),
                { enableHighAccuracy: true }
            );
        }
    }, [map]);

    // Gets the current location and sets it immediately when the component loads
    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    // Make sure the 'back to current location' button is added only once
    useEffect(() => {
        if (map && !isButtonAdded.current) {  // Check whether button have been added
            // Create a custom button get back to current location button
            const locationButton = document.createElement("div");
            locationButton.style.width = '40px';
            locationButton.style.height = '40px';
            locationButton.style.margin = '10px';
            locationButton.style.display = 'flex';
            locationButton.style.alignItems = 'center';
            locationButton.style.justifyContent = 'center';
            locationButton.style.borderRadius = '50%';
            locationButton.style.backgroundColor = 'white';
            locationButton.style.cursor = 'pointer';
            locationButton.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            locationButton.title = "Back to current location";

            // 使用HTML实体符号作为按钮内容
            locationButton.innerHTML = '&#128205;'; // 使用地图标记符号作为图标

            // 将按钮添加到地图的右侧中间
            map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

            // 点击事件监听器 - 调用获取当前位置
            locationButton.addEventListener("click", getCurrentLocation);

            isButtonAdded.current = true;  // 标记控件已经被添加
        }
    }, [map, getCurrentLocation]);

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
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

                <div className="absolute bg-white p-3 rounded-full shadow" style={{top: '80px', right: '20px'}}>
                    {/*<Image*/}
                    {/*    src="/Icon.png"*/}
                    {/*    alt="Person icon"*/}
                    {/*    width={30}*/}
                    {/*    height={30}*/}
                    {/*/>*/}
                    <p><strong>Parent: </strong></p>
                    <p><strong>Walker: </strong></p>
                </div>
            </div>

            {/* Map Section */}
            {/* Only render the map if after get the current location */}
            {currentPosition && (
                <div className="w-full max-w-lg mt-40 flex justify-center">
                    <LoadScript googleMapsApiKey="AIzaSyB0LNcULkVV2QRvCq8hhjfg2_AZAX53QCg" language="en">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={currentPosition}  // 设置地图中心为当前位置
                            zoom={14}
                            onLoad={onLoad}
                            options={{
                                zoomControl: true, // 保留缩放控件
                                streetViewControl: true, // 保留小黄人控件
                                mapTypeControl: true, // 保留地图类型切换控件
                                fullscreenControl: true, // 保留全屏控件
                                gestureHandling: "greedy", // 用户可以用手势拖动地图
                            }}
                        >
                            <Marker position={currentPosition} />
                        </GoogleMap>
                    </LoadScript>
                </div>
            )}


            <div className="mt-auto mb-20 w-full max-w-lg px-8">
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
