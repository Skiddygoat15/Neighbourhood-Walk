"use client";

export const geocodeAddress = async (address) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const geoCodeAPI = `${apiUrl}/geocode/?address=${encodeURIComponent(address)}`
    try {
        const response = await fetch(
            geoCodeAPI,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );

        const data = await response.json();

        if (response.ok && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const formatted_address = data.results[0].formatted_address;
            console.log(`Latitude: ${lat}, Longitude: ${lng}, Address: ${formatted_address}`);
            return { lat, lng, formatted_address };
        } else {
            throw new Error(data.message || "Geocoding failed");
        }
    } catch (error) {
        console.error("Error in geocoding:", error.message);
        throw error;
    }
};