"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';


export default function ProfileManagementAccountInformationWalker() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const [userProfile, setUserProfile] = useState(null); // 用来存储API返回的数据
  const [userProfImg,setUserProfImg] = useState(null); // 用来存储API返回的数据
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const textColor = useTextColor();

  useEffect(() => {
    // 从sessionStorage获取userId和token
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token'); // 假设token保存在sessionStorage中
    const storedRoles = JSON.parse(sessionStorage.getItem('roles')) || [];
    const storedCurrentRole = sessionStorage.getItem('currentRole');
    setRoles(storedRoles);
    setCurrentRole(storedCurrentRole);


    // 如果userId和token存在，则调用API获取用户信息
    if (userId && token) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${apiUrl}/Users/getUserProfileByUserId/${userId}`, {
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
  useEffect(() => {
    // 从sessionStorage获取userId和token
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token'); // 假设token保存在sessionStorage中


    // 如果userId和token存在，则调用API获取用户信息
    if (userId && token) {
      const fetchUserProfileImgUrl = async () => {
        try {
          const response = await fetch(`${apiUrl}/Users/getUserProfImgUrl/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 在请求头中添加Bearer token
            },
          });

          if (response.ok) {
            const data = await response.text();
            setUserProfImg(data);
          } else {
            console.error('Failed to fetch user profile img url:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user profile img url:', error);
        }
      };

      fetchUserProfileImgUrl();
    } else {
      console.error('User ID or token not found in sessionStorage');
    }
  }, []);

  const handleRoleRegistration = async () => {
    const userId = sessionStorage.getItem('userId');
    const roleType = currentRole === "parent" ? "walker" : "parent"; // 动态决定要添加的角色
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/roles?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain' // 设置为 text/plain 以发送纯文本
        },
        body: roleType, // 将 roleType 作为请求体发送
      });

      if (response.ok) {
        alert("Successfully registered new role!"); // 成功弹窗
        // 更新 roles
        const updatedRoles = [...roles, roleType];
        setRoles(updatedRoles);
        sessionStorage.setItem('roles', JSON.stringify(updatedRoles));
      } else {
        console.error('Failed to register new role:', response.statusText);
      }
    } catch (error) {
      console.error('Error registering new role:', error);
    }
  };

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
      ? `${new Date(userProfile.availableDate[0]).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} ${new Date(userProfile.availableDate[0]).toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24 小时制
      })}`
      : 'N/A';

  const endDate = userProfile.availableDate && userProfile.availableDate.length >= 2
      ? `${new Date(userProfile.availableDate[1]).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} ${new Date(userProfile.availableDate[1]).toLocaleTimeString('en-AU', {
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
                <h2 className={`text-lg ml-3 mb-3 font-semibold ${textColor}`}>
                  {userProfile.name} {userProfile.surname}
                </h2>

              </div>
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                {userProfImg && (
                    <img src={userProfImg} alt="User Profile Image" className="w-auto h-auto"/>
                )}
              </div>
            </div>

            {/* Details List */}
            <div className="bg-white p-4 rounded-lg shadow-lg w-full space-y-4"
                 style={{margin: '2px', padding: '2px'}}>
              <div className="flex justify-between items-center border-b py-2 ml-2 mt-3">
                <span>Preferred Name</span>
                <div className="flex items-center mr-2">
                  <span>{userProfile.preferredName || 'N/A'}</span>
                </div>
              </div>

              {/* Date of Birth - No Edit */}
              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>Date of Birth</span>
                <div className="flex items-center mr-2">
                  <span>{new Date(userProfile.birthDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>Phone Number</span>
                <div className="flex items-center mr-2">
                  <span>+61 {userProfile.phone}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>E-mail Address</span>
                <div className="flex items-center mr-2">
                  <span>{userProfile.email}</span>
                </div>
              </div>

              {/* Address - No Edit */}
              {/*<div className="flex justify-between items-center border-b py-2 ml-2">*/}
              {/*  <span>Address</span>*/}
              {/*  <div className="flex items-center w-50 mr-2">*/}
              {/*    <span className="text-right w-full">{userProfile.address}</span>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2">
                <span>Address</span>
                <div className="flex items-center w-40">
                  <span>{userProfile.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>Communication Preference</span>
                <div className="flex items-center mr-2">
                  <span>{userProfile.communicatePref || 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>Available Dates</span>
                <div className="flex items-center mr-2">
                  <span className="text-sm opacity-70">{startDate} - {endDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b py-2 ml-2">
                <span>Skills (Multi)</span>
                <div className="flex items-center mr-2">
                  <span>{skill}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2"> {/* 使用 space-y 控制间距 */}
              <button
                  onClick={() => handleNavigation('/profile-attributes-modification-walker')}
                  className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800"
              >
                Change Profile
              </button>

              {roles.length < 2 && (
                  <button
                      onClick={handleRoleRegistration}
                      className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800"
                  >
                    {currentRole === "parent" ? "Register as Walker" : "Register as Parent"}
                  </button>
              )}
            </div>

          </div>

        </main>
      </BackgroundLayout>
  );
}
