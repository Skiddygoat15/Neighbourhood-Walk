// pages/index.js
'use client'
import React, {useState} from 'react';
import StatusCard from '../../components/StatusCard';
import Header from "../../components/Header";

export default function Home() {
    const [role, setRole] = useState('parent');
    const requestURL = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequest/${walkerId}`, myInit);
    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
                setRequestStatus(data.status);
            }})
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
            <StatusCard
                parentId="P123456"
                walkerId="W654321"
                status="Accepted"
                time="2024-09-12T14:45:00"
            />
        </div>
    );
}
