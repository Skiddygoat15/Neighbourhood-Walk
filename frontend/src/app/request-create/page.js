"use client";
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

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
    const handlePublish = () => {
        console.log('UserId: ', parentId);
        const addRequestAPI = `http://127.0.0.1:8080/requests`;
        setSendBody((prevSendBody) => ({
            ...prevSendBody,  // keep other attributes same
            startTime: combineDateAndTime(date, departureTime),
            arriveTime: combineDateAndTime(date, arriveTime)
        }));
        console.log('Request Published');
        console.log('parent:', sendBody.parent);
        console.log('Departure:', sendBody.departure);
        console.log('Destination:', sendBody.destination);
        console.log('Details:', sendBody.details);
        console.log('Estimated Departure Time:', sendBody.startTime);
        console.log('Estimated Arrival Time:', sendBody.arriveTime);
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
                        setError(data.message)
                        throw new Error(data.message || "error posting request");
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
        <main className="min-h-screen bg-white">
            <div className="max-w-md mx-auto p-4 space-y-8">
                {/* Back Button */}
                <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
                    &larr;
                </button>
                {/* Title */}
                <h1 className="text-3xl font-bold text-center">Create your request</h1>
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