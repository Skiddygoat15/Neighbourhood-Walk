"use client"
import React, {useEffect, useState} from 'react';

export default function StatusCard({ showRedDot, title, statusChanged, time, notificationId, role}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const userId = sessionStorage.getItem('userId');
    // const [role, setRole] = useState(sessionStorage.getItem('roles'));
    const [RequestStatus, setRequestStatus] = useState("Pending...");
    const myInit = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
        mode: 'cors',
        cache: 'default'
    };

    // Initialise notification status
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

    // const [showDot, setShowDot] = useState(true);  // Initial state is to display a small red dot

    // useEffect(() => {
    //     setShowDot(showRedDot); // Synchronises the showRedDot passed in by the parent component.
    // }, [showRedDot]);

    // Click event handler for hiding the little red dot and calling the check notification interface
    const handleClick = () => {
        // setShowDot(false);  // Click to set the status to not show
        // Calling the back-end interface to check for notifications
        fetch(`${apiUrl}/UPNotifications/check/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to check notification");
            }else{
                // console.info(role);
                // console.info("role is up")
                if (role === 'parent'){
                    // console.info("parent");
                    window.location.href = `/notification-parent`;
                }
                if (role === 'walker'){
                    // console.info("walker");
                    window.location.href = `/notification-walker`;
                }
            }
        }).catch(error => {
            console.error('Error checking notification:', error);
        });
    };

    // Close the notification function
    const handleCloseNotification = () => {
        // Calling back-end interface shutdown notifications
        fetch(`${apiUrl}/UPNotifications/close/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to close notification");
            }else{
                // console.info(role);
                // console.info("role is up")
                if (role.includes("parent")){
                    // console.info("parent");
                    window.location.href = `/notification-parent`;
                }
                if (role.includes("walker")){
                    // console.info("walker");
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
            position: 'relative', // Setting the container to relative positioning
            margin: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fff'
        }}>
            {/*<div style={{marginBottom: '8px', color: 'blue'}}>*/}
            {/*    <strong>showRedDot: {showRedDot === true ? 'true' : 'false'}</strong>*/}
            {/*    /!*<br></br>*!/*/}
            {/*    /!*<strong>showDot: {showRedDot === true ? 'true' : 'false'}</strong>*!/*/}
            {/*</div>*/}
            {showRedDot && (
                <span style={{
                    position: 'absolute', // The little red dot is positioned as an absolute
                    bottom: '10px',          // 10px from the bottom
                    right: '10px',        // 10px from the right
                    height: '10px',
                    width: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',  // The small red dot is red
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

            {/* Close button in the upper right corner */}
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