"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function ProfileAttributesModification() {
  const textColor = useTextColor();
  const router = useRouter();
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [emailAddress, setEmailAddress] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [preferredName, setPreferredName] = useState('');

  const countryCodes = [
    { code: '+61', country: 'Australia' },
    
  ];


  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
      console.error('User ID or token not found in sessionStorage');
      return;
    }

    // 获取用户的现有个人信息
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/Users/getUserProfileByUserId/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // 填充输入框的初始值
          setPhoneNumber(data.phone || 'N/A');
          setEmailAddress(data.email || 'N/A');
          setCommunicationPreference(data.communicatePref || 'N/A');
          setPreferredName(data.preferredName || 'N/A');
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);


  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleUpdate = async () => {
    // 从sessionStorage获取userId和token
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');


    if (!userId || !token) {
      console.error('User ID or token not found in sessionStorage');
      return;
    }

    // 准备要传递到数据库的data
    const updatedProfileData = {
      phone: phoneNumber,
      email: emailAddress,
      communicatePref: communicationPreference,
      preferredName: preferredName
    };

    try {
      // 调用API将数据传入数据库
      const response = await fetch(`http://localhost:8080/Users/${userId}/profile`, {
        method: 'PUT', // 使用PUT方法更新用户数据
        headers: {
          'Authorization': `Bearer ${token}`, // 传入token进行身份验证
          'Content-Type': 'application/json', // 发送JSON数据
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        sessionStorage.setItem('preferredName', preferredName);
        // 更新成功后跳转到 profile-management-account-information 页面
        router.push('/profile-management-account-information');
      } else {
        const errorMessage = await response.text(); // 捕获后端返回的错误消息
        setError(errorMessage || 'Registration failed'); // 直接设置错误信息
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
      <BackgroundLayout>
    <main className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 55px)', overflowY: 'auto'}}>
        {/* Back Button */}
        <button onClick={() => router.back()} className={`text-2xl p-2 ${textColor} focus:outline-none`}>
          &larr;
        </button>

        {/* Title */}
        <h1 className={`block text-2xl ${textColor} font-bold text-center mb-2`}>Profile Attributes Modification</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className= {`block text-sm  ${textColor} font-bold text-left"`}>Phone Number</label>
              <p className={`block text-xs  ${textColor} font-medium text-left`}>You will use this number to receive notifications and to log in and
                restore your account</p>
              <div className="flex items-center mt-2">
                <select
                    className="border border-gray-300 p-4 rounded-l-md"
                    value={countryCode}
                    onChange={handleCountryChange}
                >
                  {countryCodes.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.country} ({item.code})
                      </option>
                  ))}
                </select>
                <input
                    type="text"
                    className="border border-gray-300 p-4 rounded-r-md w-full"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {/*<p className="text-xs text-gray-500">The system will send you a verification code</p>*/}
            </div>

            {/* Email Address */}
            <div>
              <label className={`block text-sm  ${textColor} font-bold text-left"`}>E-mail Address</label>
              <p className={`block text-xs  ${textColor} font-medium text-left`}>You will use this mailbox to receive messages</p>
              <input
                  type="email"
                  className="border border-gray-300 p-4 rounded-md w-full mt-2"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
              />
              {/*<p className="text-xs text-gray-500">The system will send you a verification code</p>*/}
            </div>

            {/* Communication Preference */}
            <div>
              <label className={`block text-sm  ${textColor} font-bold text-left"`}>Communication Preference</label>
              <select
                  className="border border-gray-300 p-4 rounded-md w-full mt-2"
                  value={communicationPreference}
                  onChange={(e) => setCommunicationPreference(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </select>
            </div>

            {/* Preferred Name */}
            <div>
              <label className={`block text-sm  ${textColor} font-bold text-left"`}>Preferred Name</label>
              <input
                  type="text"
                  className="border border-gray-300 p-4 rounded-md w-full mt-2"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
              />
            </div>
          </div>

          {/* Update Button */}
          <button
              onClick={handleUpdate}
              className="w-full py-4 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
          >
            Update
          </button>
        </div>
    </main>
        </BackgroundLayout>
);
}
