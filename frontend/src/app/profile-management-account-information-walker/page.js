"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';

export default function ProfileManagementAccountInformationWalker() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const [userProfile, setUserProfile] = useState(null); // 用来存储API返回的数据
  const [textColor, setTextColor] = useState('text-black');

  useEffect(() => {
    // 从localStorage获取userId和token
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // 假设token保存在localStorage中


    // 如果userId和token存在，则调用API获取用户信息
    if (userId && token) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`http://localhost:8080/Users/getUserProfileByUserId/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 在请求头中添加Bearer token
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            console.error('Failed to fetch user profile:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    } else {
      console.error('User ID or token not found in localStorage');
    }
  }, []);


  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 17) {
      setTextColor('text-black');
    } else {
      setTextColor('text-white');
    }
  }, []);

  if (!userProfile) {
    return <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-8">
        {/* Title */}
        <h1 className={`text-2xl font-bold ${textColor}`}>
          Account Information
        </h1>

        {/* User Info Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Loading...</h2>
          </div>
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span>Image</span>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b py-2">
            <span>Preferred Name</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          {/* Date of Birth - No Edit */}
          <div className="flex justify-between items-center border-b py-2">
            <span>Date of Birth</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Phone Number</span>
            <div className="flex items-center">
              <span>+61 Loading...</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>E-mail Address</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          {/* Address - No Edit */}
          <div className="flex justify-between items-center border-b py-2">
            <span>Address</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Communication Preference</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Available Dates</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-b py-2">
            <span>Skills (Multi)</span>
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          </div>
        </div>

        {/* Change Button */}
        <button
            onClick={() => handleNavigation('/profile-attributes-modification-walker')}
            className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
        >
          Change Profile
        </button>
      </div>

    </main>; // 如果数据还没加载完，显示Loading
  }

  // 格式化日期为 YYYY/MM/DD HH:mm
  const formatDate = (dateString) => {
    const options = {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(',', '');
  };

  // 确保 availableDate 存在并且有两个日期
  const startDate = userProfile.availableDate && userProfile.availableDate.length >= 2
      ? `${new Date(userProfile.availableDate[0]).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} ${new Date(userProfile.availableDate[0]).toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24 小时制
      })}`
      : 'N/A';

  const endDate = userProfile.availableDate && userProfile.availableDate.length >= 2
      ? `${new Date(userProfile.availableDate[1]).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} ${new Date(userProfile.availableDate[1]).toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24 小时制
      })}`
      : 'N/A';

  // skill 只有一个元素
  const skill = userProfile.skill && userProfile.skill.length > 0 ? userProfile.skill[0] : 'N/A';


  return (
      <BackgroundLayout>
        <main className="min-h-screen mb-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8"
               style={{height: 'calc(100vh - 55px)', overflowY: 'auto'}}>
            {/* Title */}
            <h1 className={`text-2xl font-bold text-center mt-6 ${textColor}`}>
              Account Information
            </h1>

            {/* User Info Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg font-semibold ${textColor}`}>
                  {userProfile.name} {userProfile.surname}
                </h2>

              </div>
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span>Image</span>
              </div>
            </div>

            {/* Details List */}
            <div className="bg-white p-4 rounded-lg shadow-lg w-full space-y-4"
                 style={{margin: '2px', padding: '2px'}}>
              <div className="flex justify-between items-center border-b py-2">
                <span>Preferred Name</span>
                <div className="flex items-center">
                  <span>{userProfile.preferredName || 'N/A'}</span>
                </div>
              </div>

              {/* Date of Birth - No Edit */}
              <div className="flex justify-between items-center border-b py-2">
                <span>Date of Birth</span>
                <div className="flex items-center">
                  <span>{new Date(userProfile.birthDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2">
                <span>Phone Number</span>
                <div className="flex items-center">
                  <span>+61 {userProfile.phone}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2">
                <span>E-mail Address</span>
                <div className="flex items-center">
                  <span>{userProfile.email}</span>
                </div>
              </div>

              {/* Address - No Edit */}
              <div className="flex justify-between items-center border-b py-2">
                <span>Address</span>
                <div className="flex items-center">
                  <span>{userProfile.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2">
                <span>Communication Preference</span>
                <div className="flex items-center">
                  <span>{userProfile.communicatePref || 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2">
                <span>Available Dates</span>
                <div className="flex items-center">
                  <span className="text-sm opacity-70">{startDate} - {endDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2">
                <span>Skills (Multi)</span>
                <div className="flex items-center">
                  <span>{skill}</span>
                </div>
              </div>
            </div>

            {/* Change Button */}
            <button
                onClick={() => handleNavigation('/profile-attributes-modification-walker')}
                className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
            >
              Change Profile
            </button>
          </div>

        </main>
      </BackgroundLayout>
  );
}
