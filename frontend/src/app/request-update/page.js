"use client";
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { geocodeAddress } from '@/components/geocode';
import useTextColor from '../ui-background-components/useTextColor';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';

export default function UpdateRequest() {
  const router = useRouter();

  // State to hold the request data
  const [departureTime, setDepartureTime] = useState({ hour: '', minute: '', period: 'AM' });
  const [arriveTime, setArriveTime] = useState({ hour: '', minute: '', period: 'AM' });
  const [date, setDate] = useState('');
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const textColor = useTextColor();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [sendBody, setSendBody] = useState({
    startTime: new Date(),
    arriveTime: new Date(),
    departure: '',
    departureZip: '',
    destination: '',
    destinationZip: '',
    details: ''
  });

  useEffect(() => {
    const storedRequest = sessionStorage.getItem('updateRequest');
    //console.log("storedRequest: ", storedRequest);
    if (storedRequest) {
      setRequest(JSON.parse(storedRequest));
      console.log("request need to update", request);
    }
  }, []); // Empty arrays are used as dependencies to ensure that they are only executed once when the component is mounted

  useEffect(() => {
    if (request) {
      console.log("current request:", request);
      setSendBody(
          (prevSendBody) => ({
            ...prevSendBody,
            departure: request.departure,
            departureZip: extractPostalCode(request.departure),
            destination: request.destination,
            destinationZip: extractPostalCode(request.destination),
            details: request.details
          }))
    }
  }, [request]);

  const handleUpdate = async () => {
    const updateRequestAPI = `${apiUrl}/requests/update/${request.requestId}`;

    try{
      if (!sendBody.departure || sendBody.departure.trim() === '' ||
          !sendBody.departureZip || sendBody.departureZip.trim() === '') {
        throw new Error("Departure and Zip code is required.");
      }

      if (!sendBody.destination || sendBody.destination.trim() === '' ||
          !sendBody.destinationZip || sendBody.destinationZip.trim() === '') {
        throw new Error("Destination and Zip code is required.");
      }

      if (!/^\d{4}$/.test(sendBody.destinationZip)) {
        setError("Zip Code must be numeric and 4 digits");
        return;
      }

      if (!date || !departureTime || departureTime.hour === '' || departureTime.minute === '') {
        throw new Error("Departure Date and Time is required.");
      }

      if (!arriveTime || arriveTime.hour === '' || arriveTime.minute === '') {
        throw new Error("Arrive Time is required.");
      }

      if (departureTime.hour < 0 || departureTime.hour > 12
          || arriveTime.hour < 0 || arriveTime.hour > 12) {
        throw new Error("Hour must be between 0 and 12.");
      }

      if (departureTime.minute < 0 || departureTime.minute > 59
          || arriveTime.minute < 0 || arriveTime.minute > 59) {
        throw new Error("Minute must be between 0 and 59.");
      }

      const currentDateTime = new Date();
      const departureDateTime = combineDateAndTime(date, departureTime);
      const arriveDateTime = combineDateAndTime(date, arriveTime);
      console.log("departureDT: " + departureDateTime);
      console.log("arriveDT: " + arriveDateTime);

      if (departureDateTime < currentDateTime) {
        throw new Error("Departure Date / Time cannot be in the past.");
      }

      if (arriveDateTime <= departureDateTime) {
        throw new Error("Arrival time must be later than departure time.");
      }

      // Get the latitude and longitude of the departure
      const departureCoords = await geocodeAddress(`${sendBody.departure}, ${sendBody.departureZip}`);
      // Get the latitude and longitude of the destination
      const destinationCoords = await geocodeAddress(`${sendBody.destination}, ${sendBody.destinationZip}`);

      // Create new sendBody data
      const updatedSendBody = {
        ...sendBody,  // keep other attributes same
        startTime: departureDateTime,
        arriveTime: arriveDateTime,
        departure: departureCoords.formatted_address,
        departureLatitude: departureCoords.lat,
        departureLongitude: departureCoords.lng,
        destination: destinationCoords.formatted_address,
        destinationLatitude: destinationCoords.lat,
        destinationLongitude: destinationCoords.lng
      };

      fetch(updateRequestAPI, {
        method: 'put', // Method is GET to fetch data
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', // Set the content type header for JSON data
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify(updatedSendBody)
      })
          .then(response => {
            if (!response.ok) {
              if (response.status === 401) {
                alert('Please log in.');
                router.push('/Login');
                return;
              }
              return response.text().then(text => {
                setError(text);
                //alert(text);
                throw new Error(text);
              });
            }
            return response.json();
          })
          .then(data => {
            console.log("update request successful", data)
            alert("update request successful")
            router.push('/request-my-request')
          })
          .catch(err => {
            console.log(err);
            const errorMessage = err.message || 'create request failed';
            setError(errorMessage);
            //setError('Failed to get contribution. Please try again.');
          });

    } catch (err) {
      console.log("Error in geocoding:", err);
      const errorMessage = err.message || 'Geocoding failed';
      setError(errorMessage);
    }
  };

  function convertTo24HourTime(time) {
    let { hour, minute, period } = time;
    // Converting hour to a number ensures that addition and subtraction can be performed.
    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);
    // If the time is PM and the number of hours is less than 12, you need to add 12 to the number of hours
    if (period === 'PM' && hour < 12) {
      hour += 12;
    }
    // If it is AM and the hour is 12 (midnight), set the hour to 00
    if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return { hour, minute };
  }

  function combineDateAndTime(date, time) {
    const { hour, minute } = convertTo24HourTime(time);
    // Use the Date object in local time
    const combinedDate = new Date(date);
    combinedDate.setHours(hour, minute, 0, 0);
    // Returns the local time string without the "Z" suffix.
    return combinedDate.toISOString().slice(0, 19);
  }

  // Functions for extracting postal codes from address strings
  function extractPostalCode(address) {
    // Regular expression to match the four digits before the second comma
    console.log("address: " + address);
    const postalCodeMatch = address.match(/(\d{4})(?=, [^,]*$)/);
    console.log("postal: " + postalCodeMatch);
    // Returns the postcode if the match is successful, otherwise returns the empty string
    return postalCodeMatch ? postalCodeMatch[1] : '';
  }

  return (
      <BackgroundLayout>
    <main className="min-h-screen">
      <button onClick={() => router.push("/request-my-request")} className={`text-2xl ${textColor} p-4 text-left`}>
        &larr;
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="max-w-md mx-auto p-4 space-y-8 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="border p-4 bg-white rounded-lg space-y-2">

          <h1 className="text-2xl font-bold text-center">Update request</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">Departure:</label>
              <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={sendBody.departure}
                    onChange={(e) => setSendBody(
                        (prevSendBody) => ({
                          ...prevSendBody,
                          departure: e.target.value
                        }))}
                    className="w-full border-b-2 border-black focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-lg font-medium whitespace-nowrap mr-2">Zip Code:</label>
                <input
                    type="text"
                    placeholder=" Postal Code"
                    value={sendBody.departureZip}
                    onChange={(e) => setSendBody((prev) => ({...prev, departureZip: e.target.value}))}
                    className="w-full border-b-2 border-black focus:outline-none mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Destination:</label>
              <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={sendBody.destination}
                    onChange={(e) => setSendBody(
                        (prevSendBody) => ({
                          ...prevSendBody,
                          destination: e.target.value
                        }))}
                    className="w-full border-b-2 border-black focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-lg font-medium whitespace-nowrap mr-2">Zip Code:</label>
                <input
                    type="text"
                    placeholder=" Postal Code"
                    value={sendBody.destinationZip}
                    onChange={(e) => setSendBody((prev) => ({...prev, destinationZip: e.target.value}))}
                    className="w-full border-b-2 border-black focus:outline-none mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold">Details:</label>
              <input
                  type="text"
                  value={sendBody.details}
                  onChange={(e) => setSendBody(
                      (prevSendBody) => ({
                        ...prevSendBody,
                        details: e.target.value
                      }))}
                  placeholder="Enter walk details"
                  className="w-full p-3 border border-black rounded-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold">Estimated departure:</label>
              <div className="flex text-sm space-x-2">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-black rounded-lg"
                />
                <div className="flex text-sm space-x-2">
                  <input
                      type="number"
                      value={departureTime.hour}
                      onChange={(e) => setDepartureTime({...departureTime, hour: e.target.value})}
                      placeholder="HH"
                      className="w-12 p-3 border border-black rounded-lg text-center"
                  />
                  <span className="text-sm">:</span>
                  <input
                      type="number"
                      value={departureTime.minute}
                      onChange={(e) => setDepartureTime({...departureTime, minute: e.target.value})}
                      placeholder="MM"
                      className="w-12 p-3 border border-black rounded-lg text-center"
                  />
                  <select
                      value={departureTime.period}
                      onChange={(e) => setDepartureTime({...departureTime, period: e.target.value})}
                      className="w-15 p-2 border border-black rounded-lg text-sm ml-[10px]"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold">Estimated Arrival:</label>
              <div className="flex space-x-2">
                <input
                    type="number"
                    value={arriveTime.hour}
                    onChange={(e) => setArriveTime({...arriveTime, hour: e.target.value})}
                    placeholder="HH"
                    className="w-16 p-3 border border-black rounded-lg text-center"
                />
                <span className="text-lg">:</span>
                <input
                    type="number"
                    value={arriveTime.minute}
                    onChange={(e) => setArriveTime({...arriveTime, minute: e.target.value})}
                    placeholder="MM"
                    className="w-16 p-3 border border-black rounded-lg text-center"
                />
                <select
                    value={arriveTime.period}
                    onChange={(e) => setArriveTime({...arriveTime, period: e.target.value})}
                    className="p-3 border border-black rounded-lg"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <button
                onClick={handleUpdate}
                className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
        </div>
    </main>
      </BackgroundLayout>
);
}
