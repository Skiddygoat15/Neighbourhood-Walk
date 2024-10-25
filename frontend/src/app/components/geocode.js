"use client";

export const geocodeAddress = async (address) => {
    try {
        const response = await fetch(
            `http://localhost:8080/geocode/?address=${encodeURIComponent(address)}`,
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