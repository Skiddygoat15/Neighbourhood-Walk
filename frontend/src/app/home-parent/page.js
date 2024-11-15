"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useEffect, useState } from 'react';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';


export default function HomeParent() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogOut = () => {
    // Clearing user information from sessionStorage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('preferredName');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('currentRole');
    sessionStorage.removeItem('clickedRequest');
    sessionStorage.removeItem('updateRequest');

    // Set isLogin and isAdmin to false!
    sessionStorage.setItem('isLogin', 'false');
    sessionStorage.setItem('isAdmin', 'false');

    // Redirect to login page
    window.location.href = `/registration-login-coverpage`;
  };

  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showRedDot, setShowRedDot] = useState(false);
  const [avgUserRating, setAvgUserRating] = useState(null); // Used to store the avgUserRating value returned by the API
  const [backgroundTheme, setBackgroundTheme] = useState('morning');
  const [textColor, setTextColor] = useState('text-black');



  useEffect(() => {
    const storedName = sessionStorage.getItem('name') || 'Guest';
    const storedPreferredName = sessionStorage.getItem('preferredName') || null;
    setName(storedName);
    setPreferredName(storedPreferredName);

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 6 && currentHour < 12) {

      setGreeting(storedPreferredName && storedPreferredName !== 'null'
          ? `Good morning, ${storedPreferredName}!`
          : `Good morning, ${storedName}!`);
      setTextColor('text-black');
    } else if (currentHour >= 12 && currentHour < 17) {

      setGreeting(storedPreferredName && storedPreferredName !== 'null'
          ? `Good afternoon, ${storedPreferredName}!`
          : `Good afternoon, ${storedName}!`);
      setTextColor('text-black');
    } else if (currentHour >= 17 && currentHour < 24) {

      setGreeting(storedPreferredName && storedPreferredName !== 'null'
          ? `Good evening, ${storedPreferredName}!`
          : `Good evening, ${storedName}!`);
      setTextColor('text-white');
    } else {
      setGreeting(storedPreferredName && storedPreferredName !== 'null'
          ? `Hi ${storedPreferredName}, It's already midnight!`
          : `Hi ${storedName}, It's already midnight!`);
      setTextColor('text-white');
    }
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log("Fetching avgUserRating for userId:", userId); // Output userId for checking

    if (!userId) {
      console.error('UserId not found in sessionStorage');
      return;
    }

    // Call the API to get the avgUserRating
    const fetchAvgUserRating = async () => {
      try {
        const response = await fetch(`${apiUrl}/Users/getUserById/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvgUserRating(data.avgUserRating); // Store the avgUserRating returned by the API to state
          console.log(data.avgUserRating);
        } else {
          console.error('Failed to fetch user rating:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    fetchAvgUserRating();
    // Check for unread notifications
    const checkNotifications = async () => {
      try {
        const response = await fetch(`${apiUrl}/UPNotifications/check-any-notification-unchecked-parent/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        const data = await response.json();
        if (data === true) {
          setShowRedDot(true);
        } else {
          setShowRedDot(false);
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    checkNotifications();
  }, []);

  return (
      <BackgroundLayout>
        <div className="mt-4 text-center">
          <h1 className={`text-lg font-semibold ${textColor}`}>
            {greeting}
          </h1>
          <p className={`text-base font-semibold ${textColor} text-opacity-60`}>
            You are logged in as a parent
          </p>
        </div>


        <div className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
              <p className="font-semibold">Stars</p>
              <p className="text-xl mr-3">
                ⭐ {avgUserRating ? `${avgUserRating}/5` : '-/5'}
              </p>
            </div>
            <div
                className="bg-white border rounded-lg p-4 text-center cursor-pointer"
                onClick={() => handleNavigation('/home-history-request-parent-test3')}
            >
              <p className="font-semibold">History</p>
            </div>
          </div>


          <div className="mt-8 space-y-4">
            <button
                onClick={() => handleNavigation('/search-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Search Walker
            </button>
            <button
                onClick={() => handleNavigation('/pre-meet-parent-info')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Pre-meet History
            </button>
            <button
                onClick={() => handleNavigation('/request-create')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Request
            </button>
            <button
                onClick={() => handleNavigation('/notification-parent')}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold relative"
            >
              Notification
              {showRedDot && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    height: '10px',
                    width: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                  }}></span>
              )}
            </button>
            <button
                onClick={() => handleLogOut()}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Log out
            </button>

          </div>
        </div>
      </BackgroundLayout>
  )

}
