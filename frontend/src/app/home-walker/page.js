"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';

export default function HomeWalker() {
  const router = useRouter();
  const [showRedDot, setShowRedDot] = useState(false);

  const handleNavigation = (path) => {
    router.push(path);
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogOut = () => {
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
  const [avgUserRating, setAvgUserRating] = useState(null); // Used to store the avgUserRating value returned by the API
  const [backgroundTheme, setBackgroundTheme] = useState('morning');
  const [textColor, setTextColor] = useState('text-black');


  useEffect(() => {
    const storedName = sessionStorage.getItem('name') || 'Guest'; // The default value is 'Guest'
    const storedPreferredName = sessionStorage.getItem('preferredName') || null;
    setName(storedName);
    setPreferredName(storedPreferredName);

    // Get the current system time and set the greeting
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
        const userId = sessionStorage.getItem('userId');

        if (!userId) {
          console.error('UserId not found in sessionStorage');
          return;
        }
        const response = await fetch(`${apiUrl}/UPNotifications/check-any-notification-unchecked/${userId}`, {
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
            You are logged in as a walker
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
            <div className="bg-white border rounded-lg p-4 text-center"
                 onClick={() => handleNavigation('/home-history-request-walker-test3')}>
              <p className="font-semibold">History</p>
            </div>
          </div>

          <div className="mt-8">
            <button onClick={() => handleNavigation('/search-walker')}
                    className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
              Search Request
            </button>
          </div>

          <div className="mt-4">
            <button onClick={() => handleNavigation('/pre-meet-walker')}
                    className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
              Pre-meet Requests
            </button>
          </div>

          <div className="mt-4">
            <button onClick={() => handleNavigation('/request-status-walker')}
                    className="w-full bg-white border rounded-lg p-4 text-center font-semibold">
              Request Respond
            </button>
          </div>

          <div className="mt-4">
            <button
                onClick={() => handleNavigation('/notification-walker')}
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
          </div>

          <div className="mt-4">
            <button
                onClick={() => handleLogOut()}
                className="w-full bg-white border rounded-lg p-4 text-center font-semibold"
            >
              Log out
            </button>
          </div>
        </div>

      </BackgroundLayout>
  );
}
