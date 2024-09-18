"use client";

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateRequest() {
  const router = useRouter();

  // State to hold the request data
  const [departureTime, setDepartureTime] = useState({ hour: '', minute: '', period: 'AM' });
  const [arriveTime, setArriveTime] = useState({ hour: '', minute: '', period: 'AM' });
  const [date, setDate] = useState('');
  const [request, setRequest] = useState(null);

  const [sendBody, setSendBody] = useState({
    startTime: new Date(),
    arriveTime: new Date(),
    departure: '',
    destination: '',
    details: ''
  });

  useEffect(() => {
    const storedRequest = localStorage.getItem('updateRequest');
    //console.log("storedRequest: ", storedRequest);
    if (storedRequest) {
      setRequest(JSON.parse(storedRequest));
      console.log("request need to update", request);
    }
  }, []); // 空数组作为依赖，确保只在组件挂载时执行一次

  useEffect(() => {
    if (request) {
      console.log("current request:", request);
      setSendBody(
          (prevSendBody) => ({
            ...prevSendBody,
            departure: request.departure,
            destination: request.destination,
            details: request.details
          }))
    }
  }, [request]);

  const handleUpdate = () => {
    const updateRequestAPI = `http://127.0.0.1:8080/requests/update/${request.requestId}`;
    setSendBody((prevSendBody) => ({
      ...prevSendBody,  // keep other attributes same
      startTime: combineDateAndTime(date, departureTime),
      arriveTime: combineDateAndTime(date, arriveTime)
    }));

    fetch(updateRequestAPI, {
      method: 'put', // Method is GET to fetch data
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Set the content type header for JSON data
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(sendBody)
    })
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              alert('Please log in.');
              router.push('/Login');
              return;
            }
            return response.json().then(data => {
              alert(data.message)
              throw new Error(data.message || "error posting request");
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
          //setError('Failed to get contribution. Please try again.');
        });
  };

  function convertTo24HourTime(time) {
    let { hour, minute, period } = time;
    // 转换hour为数字，确保可以进行加减运算
    hour = parseInt(hour, 10);
    // 如果时间是PM且小时数小于12，则需要将小时数加12
    if (period === 'PM' && hour < 12) {
      hour += 12;
    }
    // 如果是AM且小时为12（午夜），则将小时设为00
    if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    // 确保小时和分钟是两位数格式
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    return `${hourStr}:${minuteStr}:00`; // 秒数为00
  }
  function combineDateAndTime(date, time) {
    const formattedTime = convertTo24HourTime(time);
    return `${date}T${formattedTime}`;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.push("/request-my-request")} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Update request</h1>

        {/* Update Fields */}
        <div className="space-y-4">
          {/* Departure Field */}
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
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Destination Field */}
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
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
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

          {/* Estimated Departure */}
          <div>
            <label className="block text-lg font-semibold">Estimated departure:</label>
            <div className="flex space-x-4">
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-black rounded-lg"
              />
              <div className="flex space-x-2">
                <input
                    type="number"
                    value={departureTime.hour}
                    onChange={(e) => setDepartureTime({ ...departureTime, hour: e.target.value })}
                    placeholder="HH"
                    className="w-16 p-3 border border-black rounded-lg text-center"
                />
                <span className="text-lg">:</span>
                <input
                    type="number"
                    value={departureTime.minute}
                    onChange={(e) => setDepartureTime({ ...departureTime, minute: e.target.value })}
                    placeholder="MM"
                    className="w-16 p-3 border border-black rounded-lg text-center"
                />
                <select
                    value={departureTime.period}
                    onChange={(e) => setDepartureTime({ ...departureTime, period: e.target.value })}
                    className="p-3 border border-black rounded-lg"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
          {/* Estimated Arrival */}
          <div>
            <label className="block text-lg font-semibold">Estimated Arrival:</label>
            <div className="flex space-x-2">
              <input
                  type="number"
                  value={arriveTime.hour}
                  onChange={(e) => setArriveTime({ ...arriveTime, hour: e.target.value })}
                  placeholder="HH"
                  className="w-16 p-3 border border-black rounded-lg text-center"
              />
              <span className="text-lg">:</span>
              <input
                  type="number"
                  value={arriveTime.minute}
                  onChange={(e) => setArriveTime({ ...arriveTime, minute: e.target.value })}
                  placeholder="MM"
                  className="w-16 p-3 border border-black rounded-lg text-center"
              />
              <select
                  value={arriveTime.period}
                  onChange={(e) => setArriveTime({ ...arriveTime, period: e.target.value })}
                  className="p-3 border border-black rounded-lg"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
          >
            Update
          </button>
        </div>
      </div>
    </main>
  );
}
