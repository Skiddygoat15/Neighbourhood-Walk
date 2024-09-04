import React, { useState } from 'react';
import NotificationItem from '../components/NotificationItem';
import { useRouter } from 'next/router';

const notificationsData = [
    { id: 1, name: 'Abigail', status: 'Accepted', time: '23 min' },
    { id: 2, name: 'Elizabeth', status: 'Pending', message: 'Ok, see you then.', time: '27 min' },
    { id: 3, name: 'Penelope', status: 'Pending', message: 'Hey! What’s up, long time..', time: '33 min' },
    { id: 4, name: 'Chloe', status: 'Pending', message: 'Hello how are you?', time: '50 min' },
];

const NotificationsPage = () => {
    const router = useRouter();

    const handleNotificationClick = (id) => {
        router.push(`/chat?userId=${id}`);
    };

    return (
        <div>
            <h1>Notifications</h1>
            <input type="text" placeholder="Search notifications.." className="search-bar" />
            <div className="notification-list">
                {notificationsData.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;