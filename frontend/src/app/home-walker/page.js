"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomeWalker() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // 从localStorage获取name和preferredName
    const storedName = localStorage.getItem('name') || 'Guest'; // 默认值为 'Guest'
    const storedPreferredName = localStorage.getItem('preferredName') || null;
    setName(storedName);
    setPreferredName(storedPreferredName);

    // 获取系统当前时间并设置问候语
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 6 && currentHour < 12) {
      if (!storedPreferredName || storedPreferredName === 'null') {
        setGreeting(`Good morning, ${storedName}!`);
      } else {
        setGreeting(`Good morning, ${storedPreferredName}!`);
      }
    } else if (currentHour >= 12 && currentHour < 17) {
      if (!storedPreferredName || storedPreferredName === 'null') {
        setGreeting(`Good afternoon, ${storedName}!`);
      } else {
        setGreeting(`Good afternoon, ${storedPreferredName}!`);
      }
    } else if (currentHour >= 17 && currentHour < 24) {
      if (!storedPreferredName || storedPreferredName === 'null') {
        setGreeting(`Good evening, ${storedName}!`);
      } else {
        setGreeting(`Good evening, ${storedPreferredName}!`);
      }
    } else {
      if (!storedPreferredName || storedPreferredName === 'null') {
        setGreeting(`Hi ${storedName}, It's already midnight!`);
        console.log("preferredName == null")
      } else {
        setGreeting(`Hi ${storedPreferredName}, It's already midnight!`);
        console.log("preferredName != null")
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">{greeting}</p>
        <div className="w-16 h-0.5 bg-black opacity-0 mx-auto mt-1"></div>
        <p className="text-base font-normal text-opacity-60 text-black">You are logged in as a walker</p>
      </div>

      <div className="mt-8 w-full px-6">
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
            <p className="font-semibold">Stars</p>
            <p className="text-xl">⭐ -/5</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="font-semibold">History</p>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={() => handleNavigation('/search-walker')}
                  className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Search Request
          </button>
        </div>

        <div className="mt-4">
          <button className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Pre-meet
          </button>
        </div>

        <div className="mt-4">
          <button className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Request Respond
          </button>
        </div>

        <div className="mt-4">
          <button onClick={() => handleNavigation('/notification-walker')}
              className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
            Notification
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="text-center">
            <p>🏠</p>
            <p className="text-xs">Home</p>
          </button>
          <button className="text-center">
            <p>🔍</p>
            <p className="text-xs">Search</p>
          </button>
          <button className="text-center">
            <p>✉️</p>
            <p className="text-xs">Messages</p>
          </button>
          <button className="text-center">
            <p>📄</p>
            <p className="text-xs">Request</p>
          </button>
          <button className="text-center">
            <p>👤</p>
            <p className="text-xs">Profile</p>
          </button>
        </div>
      </div>
    </div>
  );
}
