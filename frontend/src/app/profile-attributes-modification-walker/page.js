"use client";

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';
import {geocodeAddress} from "@/components/geocode";

export default function ProfileManagementSelectTimeWalker() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
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

    // Access to existing personal information of users
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

          // Converts an availableDate to a datetime-local formatted value.
          // Check if the availableDate exists and has two dates.
          const startDateFormatted = data.availableDate && data.availableDate.length >= 2
              ? new Date(data.availableDate[0]).toISOString().slice(0, 16)
              : ''; // If there is no date, set to empty string
          const endDateFormatted = data.availableDate && data.availableDate.length >= 2
              ? new Date(data.availableDate[1]).toISOString().slice(0, 16)
              : ''; // If there is no date, set to empty string
          const skill = data.skill && data.skill.length > 0 ? data.skill[0] : 'N/A';
          // Initial value to fill the input box
          setPhoneNumber(data.phone || 'N/A');
          setEmailAddress(data.email || 'N/A');
          setCommunicationPreference(data.communicatePref || 'N/A');
          setPreferredName(data.preferredName || 'N/A');
          setStartDate(startDateFormatted);
          setEndDate(endDateFormatted);
          setAddress(data.address);
          setZipCode(extractPostalCode(data.address));
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

    try {
      if (!startDate) {
        throw new Error("StartDate is required.");
      }
      if (!endDate) {
        throw new Error("EndDate is required.");
      }

      // Put startDate and endDate into the availableDate array.
      const availableDate = [startDate, endDate];

      // Putting skills into the skill array ensures that there is only one skill
      const skillArray = [skills];


      if (!address || address.trim() === '' ||
          !zipCode || zipCode.trim() === '') {
        throw new Error("Address and Zip code is required.");
      }

      if (!/^\d{4}$/.test(zipCode)) {
        throw new Error("Zip Code must be numeric and 4 digits");
      }

      const updatedAddress = await geocodeAddress(`${address}, ${zipCode}`);

      // Prepare the data to be passed to the database
      const updatedProfileData = {
        preferredName,
        email: emailAddress,
        phone: phoneNumber,
        communicatePref: communicationPreference,
        availableDate,
        skill: skillArray,
        profImgUrl: profileImgUrl,
        address: updatedAddress.formatted_address,
        latitude: updatedAddress.lat,
        longitude: updatedAddress.lng,
      };

      // Call the API to pass data into the database
      const response = await fetch(`${apiUrl}/Users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        // write preferredName into sessionStorage
        sessionStorage.setItem('preferredName', preferredName);
        router.push('/profile-management-account-information-walker');
      } else {
        const errorMessage = await response.text(); // Catch error messages returned by the backend
        setError(errorMessage || 'Registration failed'); // Setting error messages directly
        console.error('Failed to update profile:', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Registration failed');
    }
  };


  return (
     <BackgroundLayout>
    <main className="min-h-screen mb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 55px)', overflowY: 'auto'}}>
        <button onClick={() => router.back()} className={`${textColor} text-2xl p-2 focus:outline-none}`}>
          &larr;
        </button>

        <h1 className={`text-2xl font-semibold mt-3 ${textColor} text-center`}>Profile Attributes Modification</h1>
        {error && <p className=" text-red-500 text-center">{error}</p>}

        <div className=" space-y-3">

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
          </div>

          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>E-mail Address</h2>
            <p className={`text-xs ${textColor}`}>You will use this mailbox to receive messages</p>
            <input
                type=" email"
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>

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

          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Preferred Name</h2>
            <input
                type=" text"
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
            />
          </div>

          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>Start Date</h2>
            <p className={`text-xs ${textColor}`}>Here you will select the start date of your available dates</p>
            <input
                type="date"
                value={startDate}
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <h2 className={`block text-sm font-medium ${textColor} text-left`}>End Date</h2>
            <p className={`text-xs ${textColor}`}>Here you will select the end date of your available dates</p>
            <input
                type="date"
                value={endDate}
                className=" border border-gray-300 p-2 rounded-md w-full mt-2"
                onChange={(e) => setEndDate(e.target.value)}
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
            className=" w-full py-3 text-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 mt-5"
        >
          Update
        </button>
      </div>

    </main>
     </BackgroundLayout>
  );
}
