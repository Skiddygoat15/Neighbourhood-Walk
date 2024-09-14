"use client";  // Add this at the very top of your file

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NotificationPage = () => {
  const router = useRouter();

  // Sample notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your application have been received', time: '4:03 pm', emoji: '😊' },
    { id: 2, message: 'Your application have been rejected', time: '10:00 am', emoji: '😞' },
    { id: 3, message: 'You receive a message from xxx', time: 'xx:xx am', emoji: '🔔' },
  ]);

  // Function to remove notification by id
  const removeNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Function to navigate to the details page when clicking the first notification
  const goToDetails = (id) => {
    if (id === 1) {
      router.push('/Notification-details-message');
    }
  };

  return (
    <div className="notifications-page">
      {/* Top Navigation with Back Button */}
      <div className="top-nav">
        <button onClick={() => router.back()} className="back-btn">←</button>
        <h2 className="notifications-title">Notifications</h2>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search notifications..." />
      </div>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="notification-item"
              onClick={() => goToDetails(notification.id)} // Trigger navigation when clicked
            >
              <span className="emoji">{notification.emoji}</span>
              <div className="notification-content">
                <span>{notification.message}</span>
                <span className="time">{notification.time}</span>
              </div>
              <button onClick={() => removeNotification(notification.id)} className="close-btn">×</button>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-navigation">
        <a href="/home" className="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75V19.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 19.5V9.75M12 2.25L3 9.75m9-7.5l9 7.5M8.25 21V10.5h7.5V21" />
          </svg>
          <span>Home</span>
        </a>
        <a href="/search" className="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </a>
        <a href="/messages" className="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 8.25v10.5A2.25 2.25 0 0119.5 21h-15a2.25 2.25 0 01-2.25-2.25V8.25m18 0A2.25 2.25 0 0019.5 6h-15A2.25 2.25 0 002.25 8.25m19.5 0L12 13.5 2.25 8.25" />
          </svg>
          <span className="active-text">Messages</span>
        </a>
        <a href="/request" className="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Request</span>
        </a>
        <a href="/profile" className="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0" />
          </svg>
          <span>Profile</span>
        </a>
      </div>

      <style jsx>{`
        .notifications-page {
          background-color: white;
          padding: 20px;
          min-height: calc(100vh - 80px);
        }
        .top-nav {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .back-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #333;
          margin-right: 10px;
        }
        .notifications-title {
          font-size: 20px;
          font-weight: bold;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .notification-item {
          background-color: #000;
          color: #fff;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 8px;
          cursor: pointer;
        }
        .emoji {
          font-size: 24px;
          margin-right: 10px;
        }
        .notification-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
        }
        .time {
          opacity: 0.7;
          font-size: 12px;
        }
        .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .bottom-navigation {
          display: flex;
          justify-content: space-around;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #ddd;
          padding: 10px 0;
        }
        .nav-item {
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        .nav-item.active,
        .nav-item .active-icon {
          color: black;
        }
        .active-text {
          font-weight: bold;
        }
        .nav-icon {
          width: 24px;
          height: 24px;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default NotificationPage;
