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

  const [userProfile, setUserProfile] = useState(null); // Used to store data returned by the API
  const [userProfImg,setUserProfImg] = useState(null); // Used to store data returned by the API
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const textColor = useTextColor();

  useEffect(() => {

    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    const storedRoles = JSON.parse(sessionStorage.getItem('roles')) || [];
    const storedCurrentRole = sessionStorage.getItem('currentRole');

    setRoles(storedRoles);
    setCurrentRole(storedCurrentRole);

    // If userId and token exist, call the API to get the user information
    if (userId && token) {
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
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    // If userId and token exist, call the API to get the user information
    if (userId && token) {
      const fetchUserProfImgUrl = async () => {
        try {
          const response = await fetch(`${apiUrl}/Users/getUserProfImgUrl/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.text();
            setUserProfImg(data);
          } else {
            console.error('Failed to fetch user profile img:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user profile img:', error);
        }
      };

      fetchUserProfImgUrl();
    } else {
      console.error('User ID or token not found in sessionStorage');
    }
  }, []);
  const handleRoleRegistration = async () => {
    const userId = sessionStorage.getItem('userId');
    const roleType = currentRole === "parent" ? "walker" : "parent"; // Dynamically determine which roles to add
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/roles?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain' // Set to text/plain to send plain text
        },
        body: roleType, // Send the roleType as a request body
      });

      if (response.ok) {
        alert("Successfully registered new role!"); // Successful pop-ups
        // Update roles
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



  // If the userProfile is not yet loaded, show the loading placeholder
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
          <h1 className={`text-2xl font-bold text-center mt-6 ${textColor}`}>
            Account Information
          </h1>

          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg ml-4 mb-4 font-semibold ${textColor}`}>
                {userProfile.name} {userProfile.surname}
              </h2>
            </div>
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              {userProfImg && (
                  <img src={userProfImg} alt="User Profile Image" className="w-auto h-auto" />
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg w-full space-y-4"
               style={{margin: '5px', padding: '5px'}}>
            <div className="flex justify-between items-center border-b py-2 sm:text-base ml-2 mt-3">
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
          <button
              onClick={() => handleNavigation('/profile-attributes-modification')}
              className="w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-8"
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
    </main>
    </BackgroundLayout>
  );
}
