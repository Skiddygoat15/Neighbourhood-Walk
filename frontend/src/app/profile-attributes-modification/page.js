"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';
import {geocodeAddress} from "@/components/geocode";

export default function ProfileAttributesModification() {
  const textColor = useTextColor();
  const router = useRouter();
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [emailAddress, setEmailAddress] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const countryCodes = [
    { code: '+61', country: 'Australia' },
    
  ];

  // Functions for extracting postal codes from address strings
  function extractPostalCode(address) {
    // Regular expression to match the four digits before the second comma
    console.log("address: " + address);
    const postalCodeMatch = address.match(/(\d{4})(?=, [^,]*$)/);
    console.log("postal: " + postalCodeMatch);
    // Returns the postcode if the match is successful, otherwise returns the empty string
    return postalCodeMatch ? postalCodeMatch[1] : '';
  }

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
        const response = await fetch(`${apiUrl}/Users/getUserProfileByUserId/${userId}`, {
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
          setAddress(data.address);
          setZipCode(extractPostalCode(data.address));
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
    try {
      if (!address || address.trim() === '' ||
          !zipCode || zipCode.trim() === '') {
        throw new Error("Address and Zip code is required.");
      }

      if (!/^\d{4}$/.test(zipCode)) {
        throw new Error("Zip Code must be numeric and 4 digits");
      }

      const updatedAddress = await geocodeAddress(`${address}, ${zipCode}`);

      // 准备要传递到数据库的data
      const updatedProfileData = {
        phone: phoneNumber,
        email: emailAddress,
        communicatePref: communicationPreference,
        preferredName: preferredName,
        profImgUrl: profileImgUrl,
        address: updatedAddress.formatted_address,
        latitude: updatedAddress.lat,
        longitude: updatedAddress.lng,
      };

      // 调用API将数据传入数据库
      const response = await fetch(`${apiUrl}/Users/${userId}/profile`, {
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
      setError(error.message || 'Registration failed');
    }
  };

  return (
      <BackgroundLayout>
    <main className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 65px)', overflowY: 'auto'}}>
        <button onClick={() => router.back()} className={`text-2xl p-2 ${textColor} focus:outline-none`}>
          &larr;
        </button>

        <h1 className={`block text-2xl ${textColor} font-bold text-center mb-2`}>Profile Attributes Modification</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-6">
          <div>
            <label className={`block text-sm  ${textColor} font-bold text-left"`}>Phone Number</label>
            <p className={`block text-xs  ${textColor} font-medium text-left`}>You will use this number to receive
              notifications and to log in and
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
          </div>

          <div>
            <label className={`block text-sm  ${textColor} font-bold text-left"`}>E-mail Address</label>
            <p className={`block text-xs  ${textColor} font-medium text-left`}>You will use this mailbox to receive
              messages</p>
            <input
                type="email"
                className="border border-gray-300 p-4 rounded-md w-full mt-2"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>

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

          <div>
            <label className={`block text-sm  ${textColor} font-bold text-left"`}>Preferred Name</label>
            <input
                type="text"
                className="border border-gray-300 p-4 rounded-md w-full mt-2"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
            />
          </div>

          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Address:</h2>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                className="w-full p-3 border border-black rounded-lg"
            />

            <div className="flex justify-between items-center">
              <label className={`text-sm ${textColor} font-medium whitespace-nowrap mr-2`}>Zip Code:</label>
              <input
                  type="text"
                  placeholder="Enter Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full border-b-2 border-black focus:outline-none mt-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 shadow-lg p-6 bg-white">
          <label className={`block text-black font-semibold text-left ml-0 mb-4`}>Change Profile
            Image</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              {value: "/profileImages/profileImg_men_1.png", label: "Option 1"},
              {value: "/profileImages/profileImg_men_2.png", label: "Option 2"},
              {value: "/profileImages/profileImg_men_3.png", label: "Option 3"},
              {value: "/profileImages/profileImg_women_1.png", label: "Option 4"},
              {value: "/profileImages/profileImg_women_2.png", label: "Option 5"},
              {value: "/profileImages/profileImg_women_3.png", label: "Option 6"}
            ].map((option) => (
                <div
                    key={option.value}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition duration-200 ease-in-out transform hover:scale-105 ${
                        profileImgUrl === option.value ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setProfileImgUrl(option.value)}
                >
                  <img src={option.value} alt={option.label} className="w-16 h-16 rounded-full mx-auto"/>
                  <p className="text-center mt-2 text-gray-600 text-sm">{option.label}</p>
                </div>
            ))}
          </div>
        </div>


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
