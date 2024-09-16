// pages/index.js
'use client'
import React, {useState} from 'react';
import StatusCard from '../../components/StatusCard';
import Header from "../../components/Header";

export default function Home() {


    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
            <StatusCard
                parentId="P123456"
                walkerId="2"
                status="Accepted"
                time="2024-09-12T14:45:00"
            />
        </div>
    );
}
