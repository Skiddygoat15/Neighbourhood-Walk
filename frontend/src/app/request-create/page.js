"use client";
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { geocodeAddress } from '@/components/geocode';

export default function WalkRequestManagementParent() {
    const router = useRouter();
    // const [departure, setDeparture] = useState('');
    // const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [departureTime, setDepartureTime] = useState({ hour: '', minute: '', period: 'AM' });
    const [arriveTime, setArriveTime] = useState({ hour: '', minute: '', period: 'AM' });
    // const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [parentId, setParentId] = useState();

    useEffect(() => {
        // 从 localStorage 获取 userId 并更新 parentId
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setParentId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (parentId) {
            setSendBody((prevSendBody) => ({
                ...prevSendBody,
                parent: { id: parentId }
            }));
        }
    }, [parentId]);

    const [sendBody, setSendBody] = useState({
        parent: {id: parentId},
        publishDate: new Date(),
        startTime: new Date(),
        arriveTime: new Date(),
        departure: '',
        destination: '',
        details: ''
    });

    const handlePublish = async () => {
        console.log('UserId: ', parentId);
        const addRequestAPI = `http://127.0.0.1:8080/requests`;
        const updatedStartTime = combineDateAndTime(date, departureTime);
        const updatedArriveTime = combineDateAndTime(date, arriveTime);

        // 获取 departure 的经纬度
        const departureCoords = await geocodeAddress(sendBody.departure);
        // 获取 destination 的经纬度
        const destinationCoords = await geocodeAddress(sendBody.destination);

        // 构造最终的请求体
        const finalSendBody = {
            departure: departureCoords.formatted_address,
            departureLatitude: departureCoords.lat,
            departureLongitude: departureCoords.lng,
            destination: destinationCoords.formatted_address,
            destinationLatitude: destinationCoords.lat,
            destinationLongitude: destinationCoords.lng,
            details: sendBody.details,
            startTime: updatedStartTime,
            arriveTime: updatedArriveTime,
            publishDate: new Date(),
            parent: { id: parentId }
        };
        console.log('Request Published');
        console.log('parent:', finalSendBody.parent);
        console.log('Departure:', finalSendBody.departure);
        console.log('Departure Latitude:', finalSendBody.departureLatitude);
        console.log('Departure Longitude:', finalSendBody.departureLongitude);
        console.log('Destination:', finalSendBody.destination);
        console.log('Destination Latitude:', finalSendBody.destinationLatitude);
        console.log('Destination Longitude:', finalSendBody.destinationLongitude);
        console.log('Details:', finalSendBody.details);
        console.log('Estimated Departure Time:', finalSendBody.startTime);
        console.log('Estimated Arrival Time:', finalSendBody.arriveTime);

        if (!date || !departureTime.hour || !departureTime.minute || !arriveTime.hour || !arriveTime.minute) {
            alert("Please fill in both date and time.");
            return;
        }
        // setSendBody({
        //   parent: {id: 2},
        //   publishDate: new Date(),
        //   startTime: combineDateAndTime(date, departureTime),
        //   arriveTime: combineDateAndTime(date, arriveTime),
        //   departure: departure,
        //   destination: destination,
        //   details: details
        // })
        fetch(addRequestAPI, {
            method: 'post', // Method is GET to fetch data
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json', // Set the content type header for JSON data
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(finalSendBody)
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
                console.log("post request successful", data)
                alert("post request successful")
                router.push('/request-my-request')
                // setContributions(data.data.filter(item =>
                //     item.status === "Pending" && item.action !== "DeleteCharacter"));
                // setLoading(false);
                setError('');
            })
            .catch(err => {
                console.log(err);
                const errorMessage = err.message || 'create request failed';
                setError(errorMessage);
                //setError('Failed to get contribution. Please try again.');
                setLoading(false);
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
        <main className="h-screen bg-white flex flex-col justify-center pb-10">
            <div className="w-full px-4 space-y-6 pb-14">
                {/* Back Button */}
                <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
                    &larr;
                </button>
                {/* Title */}
                <h1 className="text-3xl font-bold text-center">Create your request</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {/* Departure Input */}
                <div>
                    <label className="block text-lg font-semibold">Departure:</label>
                    <input
                        type="text"
                        value={sendBody.departure}
                        onChange={(e) => setSendBody(
                            (prevSendBody) => ({
                                ...prevSendBody,
                                departure: e.target.value
                            }))}
                        placeholder="Enter walk departure"
                        className="w-full p-3 border border-black rounded-lg"
                    />
                </div>
                {/* Destination Input */}
                <div>
                    <label className="block text-lg font-semibold">Destination:</label>
                    <input
                        type="text"
                        value={sendBody.destination}
                        onChange={(e) => setSendBody(
                            (prevSendBody) => ({
                                ...prevSendBody,
                                destination: e.target.value
                            }))}
                        placeholder="Enter walk destination"
                        className="w-full p-3 border border-black rounded-lg"
                    />
                </div>
                {/* details Input */}
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
                        placeholder="Enter walk descriptions"
                        className="w-full p-3 border border-black rounded-lg"
                    />
                </div>
                {/* Estimated Departure */}
                <div>
                    <label className="block text-lg font-semibold">Estimated departure:</label>
                    <div className="flex space-x-3">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border border-black rounded-lg"
                        />
                        <div className="grid grid-cols-5 text-sm gap-2">
                            <input
                                type="number"
                                value={departureTime.hour}
                                onChange={(e) => setDepartureTime({...departureTime, hour: e.target.value})}
                                placeholder="HH"
                                className="w-12 p-2 border border-black rounded-lg text-center text-sm"
                            />
                            <span className="col-span-1 flex items-center justify-center text-sm">:</span>
                            <input
                                type="number"
                                value={departureTime.minute}
                                onChange={(e) => setDepartureTime({...departureTime, minute: e.target.value})}
                                placeholder="MM"
                                className="w-12 p-2 border border-black rounded-lg text-center text-sm ml-[-10px]"
                            />
                            <select
                                value={departureTime.period}
                                onChange={(e) => setDepartureTime({...departureTime, period: e.target.value})}
                                className="w-16 p-2 border border-black rounded-lg text-sm ml-[10px]"
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
                    <div className="flex text-sm space-x-2">
                        <input
                            type="number"
                            value={arriveTime.hour}
                            onChange={(e) => setArriveTime({...arriveTime, hour: e.target.value})}
                            placeholder="HH"
                            className="w-16 p-3 border border-black rounded-lg text-center"
                        />
                        <span className="text-sm">:</span>
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
                            className="p-3 border border-black text-sm rounded-lg"
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                {/* Publish Button */}
                <button
                    onClick={handlePublish}
                    className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
                >
                    Publish
                </button>
                {/* Go to History Button */}
                <button
                    onClick={() => router.push('/request-my-request')}
                    className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
                >
                    Go to History
                </button>
            </div>
        </main>
    );
}