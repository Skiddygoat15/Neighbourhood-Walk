"use client"

import React, {useEffect, useState} from 'react';

export default function StatusCard({ showRedDot, title, statusChanged, time, notificationId, role}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const userId = sessionStorage.getItem('userId');
    const [RequestStatus, setRequestStatus] = useState("Pending...");
    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    // Initialize notification status
    const requestURL = new Request(`${apiUrl}/WalkerRequest/getWalkerRequestByWalkerId/${userId}`, myInit);

    console.log("showRedDot value:", showRedDot);


    fetch(requestURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Accepted" || data.status === "Rejected" || data.status === "Pending...") {
                setRequestStatus(data.status);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Click event handler function, used to hide the little red dot and call the check notification interface
    const handleClick = () => {
        fetch(`${apiUrl}/Notification/checkNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to check notification");
            }else{
                if (role === 'parent'){
                    window.location.href = `/notification-parent`;
                }
                if (role === 'walker'){
                    window.location.href = `/notification-walker`;
                }
            }
        }).catch(error => {
            console.error('Error checking notification:', error);
        });
    };

    // Close notification function
    const handleCloseNotification = () => {
        fetch(`${apiUrl}/Notification/closeNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to close notification");
            }else{
                if (role.includes("parent")){
                    window.location.href = `/notification-parent`;
                }
                if (role.includes("walker")){
                    window.location.href = `/notification-walker`;
                }
        }}).catch(error => {
            console.error('Error closing notification:', error);
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Accepted':
                return { color: 'green', fontWeight: 'bold', marginBottom: '8px' };
            case 'Rejected':
                return { color: 'red', fontWeight: 'bold', marginBottom: '8px' };
            case 'Pending...':
                return { color: 'blue', fontWeight: 'bold', marginBottom: '8px' };
            default:
                return { color: 'black', fontWeight: 'bold', marginBottom: '8px' };
        }
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            position: 'relative',
            margin: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'white'
        }}>
            {showRedDot && (
                <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    height: '10px',
                    width: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                }}></span>
            )}

            <div style={{marginBottom: '8px'}} >
                <strong onClick={handleClick}>{title}</strong>
            </div>

            <div style={{marginBottom: '8px'}} >
                <span style={getStatusStyle(statusChanged)} onClick={handleClick}>{statusChanged}</span>
            </div>

            <div>
                <span onClick={handleClick}>{time}</span>
            </div>

            <button onClick={handleCloseNotification} style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#ccc'
            }}>
                X
            </button>

        </div>
    );
}