"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileManagementSelectTimeWalker() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skills, setSkills] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [emailAddress, setEmailAddress] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('');
  const [preferredName, setPreferredName] = useState('');

  const countryCodes = [
    { code: '+61', country: 'Australia' },
  ];

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('User ID or token not found in localStorage');
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

          // 将 availableDate 转换为符合 datetime-local 格式的值
          // 检查 availableDate 是否存在且有两个日期
          const startDateFormatted = data.availableDate && data.availableDate.length >= 2
              ? new Date(data.availableDate[0]).toISOString().slice(0, 16)
              : ''; // 如果没有日期，设置为空字符串
          const endDateFormatted = data.availableDate && data.availableDate.length >= 2
              ? new Date(data.availableDate[1]).toISOString().slice(0, 16)
              : ''; // 如果没有日期，设置为空字符串
          const skill = data.skill && data.skill.length > 0 ? data.skill[0] : 'N/A';
          // 填充输入框的初始值
          setPhoneNumber(data.phone || 'N/A');
          setEmailAddress(data.email || 'N/A');
          setCommunicationPreference(data.communicatePref || 'N/A');
          setPreferredName(data.preferredName || 'N/A');
          setStartDate(startDateFormatted);
          setEndDate(endDateFormatted);
          setSkills(skill)
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
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('User ID or token not found in localStorage');
      return;
    }

    // 将startDate和endDate放入availableDate数组中
    const availableDate = [startDate, endDate];

    // 将skills放入skill数组中，保证只有一个技能
    const skillArray = [skills];

    // 准备要传递到数据库的data
    const updatedProfileData = {
      preferredName,
      email: emailAddress,
      phone: phoneNumber,
      communicatePref: communicationPreference,
      availableDate,
      skill: skillArray,
    };

    try {
      // 调用API将数据传入数据库
      const response = await fetch(`http://localhost:8080/Users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // 传入token进行身份验证
          'Content-Type': 'application/json', // 发送JSON数据
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        // 将 preferredName 写入 localStorage
        localStorage.setItem('preferredName', preferredName);
        // 更新成功后跳转到profile-management-account-information页面
        router.push('/profile-management-account-information-walker');
      } else {
        const errorMessage = await response.text(); // 捕获后端返回的错误消息
        setError(errorMessage || 'Registration failed'); // 直接设置错误信息
        console.error('Failed to update profile:', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  return (
    <main className="min-h-screen bg-white mb-40">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{maxHeight: 'calc(100vh - 55px)'}}>
        {/* Back Button */}
        <button onClick={() => router.back()} className="text-2xl p-2 focus:outline-none">
          &larr;
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Profile Attributes Modification</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Form Fields */}
        <div className="space-y-4">

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-xs text-gray-500">You will use this number to receive notifications and to log in and
              restore your account</p>
            <div className="flex items-center mt-2">
              <select
                  className="border border-gray-300 p-2 rounded-l-md"
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
                  className="border border-gray-300 p-2 rounded-r-md w-full"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            {/*<p className="text-xs text-gray-500">The system will send you a verification code</p>*/}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail Address</label>
            <p className="text-xs text-gray-500">You will use this mailbox to receive messages</p>
            <input
                type="email"
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
            {/*<p className="text-xs text-gray-500">The system will send you a verification code</p>*/}
          </div>

          {/* Communication Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Preference</label>
            <select
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
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
            <label className="block text-sm font-medium text-gray-700">Preferred Name</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
            />
          </div>
          {/* StartDate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <p className="text-xs text-gray-500">Here you will select the start date of your available dates</p>
            <input
                type="datetime-local"  // 使用HTML5的日期时间选择器
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* EndDate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <p className="text-xs text-gray-500">Here you will select the end date of your available dates</p>
            <input
                type="datetime-local"  // 使用HTML5的日期时间选择器
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (Multi)</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills"
            />
          </div>
        </div>

        {/* Update Button */}
        <button
            onClick={handleUpdate}
            className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
        >
          Update
        </button>
      </div>

    </main>
  );
}
