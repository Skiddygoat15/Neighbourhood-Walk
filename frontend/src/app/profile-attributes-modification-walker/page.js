"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function ProfileManagementSelectTimeWalker() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const textColor = useTextColor();
  const [date, setDate] = useState('');

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
        const response = await fetch(`${apiUrl}/Users/getUserProfileByUserId/${userId}`, {
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
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
      console.error('User ID or token not found in sessionStorage');
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
      profImgUrl: profileImgUrl
    };

    try {
      // 调用API将数据传入数据库
      const response = await fetch(`http://${apiUrl}/Users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // 传入token进行身份验证
          'Content-Type': 'application/json', // 发送JSON数据
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        // 将 preferredName 写入 sessionStorage
        sessionStorage.setItem('preferredName', preferredName);
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
     <BackgroundLayout>
    <main className="min-h-screen mb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 55px)', overflowY: 'auto'}}>
        {/* Back Button */}
        <button onClick={() => router.back()} className={`${textColor} text-2xl p-2 focus:outline-none}`}>
          &larr;
        </button>

        {/* Title */}
        <h1 className={`text-2xl font-semibold mt-3 ${textColor} text-center`}>Profile Attributes Modification</h1>
        {error && <p className=" text-red-500 text-center">{error}</p>}

        {/* Form Fields */}
        <div className=" space-y-3">

          {/* Phone Number */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Phone Number</h2>
            <p className={`text-xs ${textColor}`}>You will use this number to receive notifications and to log in and
              restore your account</p>
            <div className=" flex items-center mt-2">
              <select
                  className=" border border-gray-300 p-2 rounded-l-md"
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
                  type=" text"
                  className=" border border-gray-300 p-2 rounded-r-md w-full"
                  placeholder=" Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            {/*<p className=" text-xs text-gray-500">The system will send you a verification code</p>*/}
          </div>

          {/* Email Address */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>E-mail Address</h2>
            <p className={`text-xs ${textColor}`}>You will use this mailbox to receive messages</p>
            <input
                type=" email"
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
            {/*<p className=" text-xs text-gray-500">The system will send you a verification code</p>*/}
          </div>

          {/* Communication Preference */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Communication Preference</h2>
            <select
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={communicationPreference}
                onChange={(e) => setCommunicationPreference(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value=" Email">Email</option>
              <option value=" Phone">Phone</option>
            </select>
          </div>

          {/* Preferred Name */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Preferred Name</h2>
            <input
                type=" text"
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
            />
          </div>
          {/* StartDate */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Start Date</h2>
            <p className={`text-xs ${textColor}`}>Here you will select the start date of your available dates</p>
            <input
                // type=" datetime-local"  // 使用HTML5的日期时间选择器
                // className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                // value={startDate}
                // onChange={(e) => setStartDate(e.target.value)}
                type="date"
                value={startDate}
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* EndDate */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>End Date</h2>
            <p className={`text-xs ${textColor}`}>Here you will select the end date of your available dates</p>
            <input
                // type=" datetime-local"  // 使用HTML5的日期时间选择器
                // className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                // value={endDate}
                // onChange={(e) => setEndDate(e.target.value)}
                type="date"
                value={endDate}
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Skills */}
          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Skills (Multi)</h2>
            <input
                type=" text"
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder=" Enter your skills"
            />
          </div>
        </div>

        {/* Update Profile Images */}
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


        {/* Update Button */}
        <button
            onClick={handleUpdate}
            className=" w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-5"
        >
          Update
        </button>
      </div>

    </main>
     </BackgroundLayout>
  );
}
