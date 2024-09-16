"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useEffect, useState } from 'react';

export default function HomeParent() {
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
      <main className="min-h-screen bg-white flex flex-col items-center">
        <div className="mt-4 text-center">
          <h1 className="text-lg font-semibold">{greeting}</h1>
        </div>

        {/* Stars and History */}
        <div className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-4 text-center">
              <p className="font-semibold">Stars</p>
              <p className="text-xl">⭐ -/5</p>
            </div>
            <div
                className="bg-white border rounded-lg p-4 text-center cursor-pointer"
                onClick={() => handleNavigation('/home-history-request-parent')}
            >
              <p className="font-semibold">History</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 space-y-4">
            <button
                onClick={() => handleNavigation('/search-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Search Walker
            </button>
            <button
                onClick={() => handleNavigation('/pre-meet-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Arrange Pre-meet
            </button>
            <button
                onClick={() => handleNavigation('/request-create')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Request
            </button>
          </div>
        </div>

</main>
)
  ;
}
