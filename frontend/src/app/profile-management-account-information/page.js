"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function ProfileManagementAccountInformation() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const [userProfile, setUserProfile] = useState(null); // 用来存储API返回的数据
  const textColor = useTextColor();

  useEffect(() => {
    // 从sessionStorage获取userId和token
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token'); // 假设token保存在sessionStorage中

    // 如果userId和token存在，则调用API获取用户信息
    if (userId && token) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`http://${apiUrl}/Users/getUserProfileByUserId/${userId}`, {
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
      console.error('User ID or token not found in sessionStorage');
    }
  }, []);


  // 如果 userProfile 还没有加载，显示 loading 占位符
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
        </div>
        {/* Change Button */}
        <button
            onClick={() => handleNavigation('/profile-attributes-modification')}
            className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
        >
          Change Profile
        </button>
      </div>
    </main>
  }


  return (
      <BackgroundLayout>
      <main className="min-h-screen mb-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8" style={{ height: 'calc(100vh - 55px)', overflowY: 'auto' }}>
          {/* Title */}
          <h1 className={`text-2xl font-bold text-center mt-6 ${textColor}`}>
            Account Information
          </h1>

          {/* User Info Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg ml-4 mb-4 font-semibold ${textColor}`}>
                {userProfile.name} {userProfile.surname}
              </h2>
            </div>
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <span>Image</span>
            </div>
          </div>

          {/* Details List */}
          <div className="bg-white p-4 rounded-lg shadow-lg w-full space-y-4"
               style={{margin: '5px', padding: '5px'}}>
            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>Preferred Name</span>
              <div className="flex items-center mr-2">
                <span>{userProfile.preferredName || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>Date of Birth</span>
              <div className="flex items-center mr-2">
                <span>{new Date(userProfile.birthDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>Phone Number</span>
              <div className="flex items-center mr-2">
                <span>+61 {userProfile.phone}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>E-mail Address</span>
              <div className="flex items-center mr-2">
                <span>{userProfile.email}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>Address</span>
              <div className="flex items-center w-40">
                <span>{userProfile.address}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
              <span>Communication Preference</span>
              <div className="flex items-center mr-2">
                <span>{userProfile.communicatePref || 'N/A'}</span>
              </div>
            </div>
          </div>
          {/* Change Button */}
          <button
              onClick={() => handleNavigation('/profile-attributes-modification')}
              className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
          >
            Change Profile
          </button>
        </div>
    </main>
    </BackgroundLayout>
  );
}
