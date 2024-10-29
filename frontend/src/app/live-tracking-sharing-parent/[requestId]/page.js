"use client"
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
import {useState, useEffect, useRef, useCallback} from 'react';
import BackgroundLayout from '../../ui-background-components/BackgroundLayout';
import useTextColor from '../../ui-background-components/useTextColor';

const containerStyle = {
    width: '100%',
    height: '69vh',
};

export default function LiveTrackingSharingParent( {params} ) {
    const textColor = useTextColor();
    const router = useRouter();
    const { requestId } = params;  // obtain dynamic route param
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [currentPosition, setCurrentPosition] = useState(null); // Initially null, waiting to get the current location
    const [departurePosition, setDeparturePosition] = useState(null);
    const [destinationPosition, setDestinationPosition] = useState(null);
    const [walkerPosition, setWalkerPosition] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null);
    const [map, setMap] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false); // Track if the map is loaded
    const [isMapLoading, setIsMapLoading] = useState(true); // Track if the map is loading
    const isButtonAdded = useRef(false);  // Used to track whether a button has been added
    let parentId = null;
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
        parentId = sessionStorage.getItem('userId');
        token = sessionStorage.getItem('token');
    }

    // Get current location when component loads
    useEffect(() => {
        if (requestId) {
            getCurrentLocation();
            fetchLocations();
        }
        console.log(requestId, '---', parentId);
    }, [requestId]);

    // fetch departure and destination
    const fetchLocations = useCallback(async () => {
        try {
            const getLiveLocationInfoAPI = `http://${apiUrl}/requests/getLiveLocationByRequestId/${requestId}`;
            const response = await fetch(getLiveLocationInfoAPI, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (data.walkerLatitude && data.walkerLongitude) {
                const walker = {
                    lat: data.walkerLatitude,
                    lng: data.walkerLongitude,
                }
                setWalkerPosition(walker);
                if (map) {
                    map.panTo(walker);
                }
            }

            if (departurePosition === null) {
                const departure = {
                    lat: data.departureLatitude,
                    lng: data.departureLongitude,
                };
                setDeparturePosition(departure);
            }
            if (destinationPosition === null) {
                const destination = {
                    lat: data.destinationLatitude,
                    lng: data.destinationLongitude,
                };
                setDestinationPosition(destination);
            }

            console.log("walker Lat: " + data.walkerLatitude + " Lng: " + data.walkerLongitude);

            setRequestStatus(data.status);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }, [map]);

    useEffect(() => {
        if (requestStatus === "Completed") {
            alert("The walker has completed the request.");
            handleCommentRoute(requestId);
        }
    }, [requestStatus]);

    // Function to send updated location to backend
    const updateLocationToBackend = async (position) => {
        const updateLocationAPI = `http://${apiUrl}/requests/updateLocation/${requestId}/?walkerLatitude=${position.lat}&walkerLongitude=${position.lng}`;

        try {
            const response = await fetch(updateLocationAPI, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    alert('Please log in.');
                    router.push('/registration-loginform');
                    return;
                }

                const errorData = await response.json();
                throw new Error(errorData.message || 'Error updating location');
            }

            console.error('Location updated successfully');
        } catch (error) {
            console.error("Updating location failed:", error);
        }
    };

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
                    // updateLocationToBackend(newPosition);  // Update backend with new location
                    if (map) {
                        map.panTo(newPosition);
                    }
                },
                (error) => console.error("Error getting location: ", error),
                { enableHighAccuracy: true }
            );
        }
    }, [map]);

    // Update walker and parent location every 2 minutes
    useEffect(() => {
        const intervalId = setInterval(() => {
            getCurrentLocation();
            fetchLocations();
        }, 20000); // 2 minutes interval

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

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

            const svgIcon = document.createElement("img");
            svgIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjR' +
                'weCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjNDM0MzQzIj48cGF0aCBkPSJNNDQwLTQydi04MH' +
                'EtMTI1LTE0LTIxNC41LTEwMy41VDEyMi00NDBINDJ2LTgwaDgwcTE0LTEyNSAxMDMuNS0yMTQuNVQ0NDAtODM4di04MGg4MHY4MHExM' +
                'jUgMTQgMjE0LjUgMTAzLjVUODM4LTUyMGg4MHY4MGgtODBxLTE0IDEyNS0xMDMuNSAyMTQuNVQ1MjAtMTIydjgwaC04MFptNDAtMTU4' +
                'cTExNiAwIDE5OC04MnQ4Mi0xOThxMC0xMTYtODItMTk4dC0xOTgtODJxLTExNiAwLTE5OCA4MnQtODIgMTk4cTAgMTE2IDgyIDE5OHQ' +
                'xOTggODJabTAtMTIwcS02NiAwLTExMy00N3QtNDctMTEzcTAtNjYgNDctMTEzdDExMy00N3E2NiAwIDExMyA0N3Q0NyAxMTNxMCA2Ni' +
                '00NyAxMTN0LTExMyA0N1ptMC04MHEzMyAwIDU2LjUtMjMuNVQ1NjAtNDgwcTAtMzMtMjMuNS01Ni41VDQ4MC01NjBxLTMzIDAtNTYuN' +
                'SAyMy41VDQwMC00ODBxMCAzMyAyMy41IDU2LjVUNDgwLTQwMFptMC04MFoiLz48L3N2Zz4=';
            svgIcon.style.width = '24px';
            svgIcon.style.height = '24px';

            locationButton.appendChild(svgIcon);

            // Add the button to the right centre of the map
            map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

            // Click event listener - call to get current position
            locationButton.addEventListener("click", getCurrentLocation);

            isButtonAdded.current = true;  // Marks that the control has been added
        }
    }, [map, getCurrentLocation]);

    // handle both map and loading state
    const handleMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance); // Save map instance
        setMapLoaded(true); // Mark the map as loaded
        setIsMapLoading(false); // Map has finished loading, hide the loading message
    }, []);

    const handleCommentRoute = (id) => {
        router.push(`/live-tracking-comment-parent/${id}`);  // route to request details page with request id
    };

    return (
        <BackgroundLayout>
            <div className="relative flex flex-col items-center justify-start min-h-screen p-8">
                <div className="fixed top-0 left-0 w-full p-4 z-10">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className={`${textColor} text-2xl`}>
                            <span>&lt;</span>
                        </button>
                        <h1 className={`${textColor} text-2xl font-bold`}>Live-tracking</h1>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    {walkerPosition ? (
                        <p className={`text-lg ${textColor}`}>
                            You are tracking the location of{' '}
                            <span className="text-green-600 font-bold">Walker</span>
                        </p>
                    ) : (
                        <p className={"text-red-600 font-bold"}>
                            Walkers have not yet started walking request
                        </p>
                    )}
                </div>

                {/* Display loading message until map is fully loaded */}
                {isMapLoading && <p className="text-center text-gray-500">Map is loading...</p>}

                {/* Map Section */}
                {/* Only render the map if after get the current location */}
                {(currentPosition && departurePosition && destinationPosition) && (
                    <div className="w-full max-w-lg mt-2 flex justify-center">
                        <LoadScriptNext
                            googleMapsApiKey="AIzaSyB0LNcULkVV2QRvCq8hhjfg2_AZAX53QCg"
                            language="en"
                            loadingElement={<p>Loading...</p>}
                            defer
                            async
                        >
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={walkerPosition || currentPosition}
                                zoom={14}
                                onLoad={handleMapLoad}
                                options={{
                                    zoomControl: true,
                                    streetViewControl: true,
                                    mapTypeControl: true,
                                    fullscreenControl: true,
                                    gestureHandling: "greedy",
                                }}
                            >
                                {mapLoaded && (
                                    <Marker
                                        position={currentPosition}
                                        icon={{
                                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjRjE5RTM5Ij48cGF0aCBkPSJNNDgwLTM2MHE1NiAwIDEwMS0yNy41dDcxLTcyLjVxLTM1LTI5LTc5LTQ0LjVUNDgwLTUyMHEtNDkgMC05MyAxNS41VDMwOC00NjBxMjYgNDUgNzEgNzIuNVQ0ODAtMzYwWm0wLTIwMHEzMyAwIDU2LjUtMjMuNVQ1NjAtNjQwcTAtMzMtMjMuNS01Ni41VDQ4MC03MjBxLTMzIDAtNTYuNSAyMy41VDQwMC02NDBxMCAzMyAyMy41IDU2LjVUNDgwLTU2MFptMCAzNzRxMTIyLTExMiAxODEtMjAzLjVUNzIwLTU1MnEwLTEwOS02OS41LTE3OC41VDQ4MC04MDBxLTEwMSAwLTE3MC41IDY5LjVUMjQwLTU1MnEwIDcxIDU5IDE2Mi41VDQ4MC0xODZabTAgMTA2UTMxOS0yMTcgMjM5LjUtMzM0LjVUMTYwLTU1MnEwLTE1MCA5Ni41LTIzOVQ0ODAtODgwcTEyNyAwIDIyMy41IDg5VDgwMC01NTJxMCAxMDAtNzkuNSAyMTcuNVQ0ODAtODBabTAtNDgwWiIvPjwvc3ZnPg==',
                                            scaledSize: new window.google.maps.Size(40, 40),
                                        }}
                                    />
                                )}
                                {mapLoaded && (
                                    <Marker
                                        position={departurePosition}
                                        icon={{
                                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9z' +
                                                'dmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiB' +
                                                'maWxsPSIjMDAwMEY1Ij48cGF0aCBkPSJNMzYwLTQ0MGg4MHYtMTEwaDgwdjExMGg4MHYtMTkwbC' +
                                                '0xMjAtODAtMTIwIDgwdjE5MFptMTIwIDI1NHExMjItMTEyIDE4MS0yMDMuNVQ3MjAtNTUycTAtM' +
                                                'TA5LTY5LjUtMTc4LjVUNDgwLTgwMHEtMTAxIDAtMTcwLjUgNjkuNVQyNDAtNTUycTAgNzEgNTkg' +
                                                'MTYyLjVUNDgwLTE4NlptMCAxMDZRMzE5LTIxNyAyMzkuNS0zMzQuNVQxNjAtNTUycTAtMTUwIDk' +
                                                '2LjUtMjM5VDQ4MC04ODBxMTI3IDAgMjIzLjUgODlUODAwLTU1MnEwIDEwMC03OS41IDIxNy41VD' +
                                                'Q4MC04MFptMC00ODBaIi8+PC9zdmc+',
                                            scaledSize: new window.google.maps.Size(40, 40),
                                        }}
                                    />
                                )}
                                {mapLoaded && (
                                    <Marker
                                        position={destinationPosition}
                                        icon={{
                                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9z' +
                                                'dmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiB' +
                                                'maWxsPSIjRUEzMzIzIj48cGF0aCBkPSJtNDM4LTQyNiAxOTgtMTk4LTU3LTU3LTE0MSAxNDEtNT' +
                                                'YtNTYtNTcgNTcgMTEzIDExM1ptNDIgMjQwcTEyMi0xMTIgMTgxLTIwMy41VDcyMC01NTJxMC0xM' +
                                                'DktNjkuNS0xNzguNVQ0ODAtODAwcS0xMDEgMC0xNzAuNSA2OS41VDI0MC01NTJxMCA3MSA1OSAx' +
                                                'NjIuNVQ0ODAtMTg2Wm0wIDEwNlEzMTktMjE3IDIzOS41LTMzNC41VDE2MC01NTJxMC0xNTAgOTY' +
                                                'uNS0yMzlUNDgwLTg4MHExMjcgMCAyMjMuNSA4OVQ4MDAtNTUycTAgMTAwLTc5LjUgMjE3LjVUND' +
                                                'gwLTgwWm0wLTQ4MFoiLz48L3N2Zz4=',
                                            scaledSize: new window.google.maps.Size(40, 40),
                                        }}
                                    />
                                )}
                                {(mapLoaded && walkerPosition) && (
                                    <Marker
                                        position={walkerPosition}
                                        icon={{
                                            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9z' +
                                                'dmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiB' +
                                                'maWxsPSIjNDM0MzQzIj48cGF0aCBkPSJtMjgwLTQwIDExMi01NjQtNzIgMjh2MTM2aC04MHYtMT' +
                                                'g4bDIwMi04NnExNC02IDI5LjUtN3QyOS41IDRxMTQgNSAyNi41IDE0dDIwLjUgMjNsNDAgNjRxM' +
                                                'jYgNDIgNzAuNSA2OVQ3NjAtNTIwdjgwcS03MCAwLTEyNS0yOXQtOTQtNzRsLTI1IDEyMyA4NCA4' +
                                                'MHYzMDBoLTgwdi0yNjBsLTg0LTY0LTcyIDMyNGgtODRabTI2MC03MDBxLTMzIDAtNTYuNS0yMy4' +
                                                '1VDQ2MC04MjBxMC0zMyAyMy41LTU2LjVUNTQwLTkwMHEzMyAwIDU2LjUgMjMuNVQ2MjAtODIwcT' +
                                                'AgMzMtMjMuNSA1Ni41VDU0MC03NDBaIi8+PC9zdmc+',
                                            scaledSize: new window.google.maps.Size(40, 40),
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        </LoadScriptNext>
                    </div>
                )}

                <div className="fixed left-0 right-0 bottom-20 w-full max-w-lg px-8 mx-auto mt-30">
                    <button
                        onClick={fetchLocations}
                        className="w-full bg-black text-white text-xl py-2 rounded-lg hover:bg-gray-800"
                    >
                        Refresh Walker Location
                    </button>
                </div>
            </div>
        </BackgroundLayout>
    );
}
