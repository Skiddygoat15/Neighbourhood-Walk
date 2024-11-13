"use client"
import React, { useEffect, useState } from 'react';

// NotificationWebSocket component: receives notifications and passes data to the parent component through the callback function
const NotificationWebSocket = ({ onNewNotification }) => {
    const websocketurl = process.env.WEB_SOCKET_URL;
    useEffect(() => {
        // Create a WebSocket connection
        const ws = new WebSocket(`${websocketurl}/ws/notifications`);

        ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            console.log('Notification received:', notification);
            // Use the callback function passed by the parent component to handle new notifications
            onNewNotification(notification);
        };

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

    }, [onNewNotification]);  // Only rerun when onNewNotification callback function changes

    return null;
};

export default NotificationWebSocket;
