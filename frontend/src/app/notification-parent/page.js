'use client'
import React, {useState, useEffect} from 'react';
import StatusCard from '../../components/StatusCard';
import StatusCard_profile from '../../components/StatusCard_profile';
import Header from "../../components/Header";
import { format } from 'date-fns';
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function Home() {
    const [requestIds, setrequestIds] = useState([]);
    const [Notifications,setNotifications] = useState([]);
    const [Notifications_Profile, setNotifications_Profile] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [refreshKey, setRefreshKey] = useState(0); // The state used to trigger re-rendering

    let parentId = null;
    let userId = null;
    let role = null;
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
        parentId = sessionStorage.getItem('userId');
        userId = sessionStorage.getItem('userId');
        role = sessionStorage.getItem('currentRole');
        token = sessionStorage.getItem('token');
    }
    const textColor = useTextColor();
    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL = `${apiUrl}/requests/getRequestsByParentId/${parentId}`;
        fetch(requestURL, myInit)
            .then(response => {
                if (!response.ok) {throw new Error('Network response was not ok0');}
                return response.json();})
            .then(data => {
                setrequestIds(data.map(item => item.requestId));
            })
            .catch(error => {
                console.error('Error fetching data:', error);});
    },[parentId, refreshKey]);


    // GetNotifications
    function fetchData(requestId) {
        return fetch(`${apiUrl}/Notification/findNotificationByRequestId/${requestId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for requestId ${requestId}`);
                }
                return response.json();
            }).then(data => {
                console.log(`Data received for requestId ${requestId}:`, data);
                return data;
            })
            .catch(error => {
                console.error(`Error fetching data for requestId ${requestId}:`, error);
            });
    }

    // GetUPNotifications
    function fetchData_Profile(userId) {
        return fetch(`${apiUrl}/UPNotifications/getUPNotificationsByUserId/${userId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        })
            .then(response_profile => {
                if (!response_profile.ok) {
                    throw new Error(`Failed to fetch data for requestId ${userId}`);
                }
                return response_profile.json();
            }).then(data_profile => {
                return data_profile;
            })
            .catch(error => {
                console.error(`Error fetching data for requestId ${UPNotificationId}:`, error);
            });
    }

    function fetchAllData(requestIds) {
        const promises = requestIds.map(fetchData); // Create an array of promises
        Promise.all(promises)
            .then(results => {
                setNotifications(results.flat());
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }

    function fetchAllData_Profile(userId) {
        fetchData_Profile(userId)
            .then(results => {
                setNotifications_Profile(results);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }

    useEffect(() => {
        if (requestIds.length > 0) { // Make sure requestIds is not an empty array
            fetchAllData(requestIds);
        }
    }, [requestIds, refreshKey]); // When requestIds is updated, call fetchAllData again

    // 保留fetchAllData_Profile单独执行
    useEffect(() => {
        fetchAllData_Profile(userId);
    }, [userId]); // Ensure that profile notifications can be executed independently



    //获取notification对应walker的surname
    function fetchWalkerByNotification(notificationId) {
        return fetch(`${apiUrl}/Notification/findWalkerByNotification/${notificationId}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch walker data for notificationId ${notificationId}`);
                }
                return response.json();
            })
            .then(data => data.surname)  // Assuming the API returns an object with a surname field
            .catch(error => {
                console.error('Error fetching walker data:', error);
            },[notificationId]);
    }

    function fetchAllWalkers() {
        const promises = Notifications.map(notification => {
            if (!notification || notification.notificationId === null || notification.notificationId === undefined) {
                console.error("Notification or notificationId is null/undefined", notification);
                return Promise.resolve(notification); // Skip this notification if notificationId is null or undefined
            }
            return fetchWalkerByNotification(notification.notificationId)
                .then(surname => {
                    return {
                        ...notification,
                        walkerSurname: surname
                    };
                });
        });

        // 等待所有异步操作完成
        Promise.all(promises)
            .then(results => {
                setNotifications(results);
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }

    useEffect(() => {
        fetchAllWalkers();
    },[Notifications.length,refreshKey]); // Depends on changes in Notifications array

    // Trigger page refresh by updating refreshKey
    const refreshPage = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <BackgroundLayout>
        <div className="flex flex-col h-screen p-4" style={{ overflowY: 'auto' }}>
            <Header title="Notification-parent" navigateTo={"/home-parent"} textColor={textColor} />

            {Notifications && Notifications.length > 0 && Notifications.map((notification, index) => {
                console.info(notification);
                console.info("refreshPage"+refreshKey);
                if (!notification || notification.notificationClose === null || notification.notificationClose === undefined) {
                    console.error("Notification or notificationClose is null/undefined", notification);
                    return null;
                }
                if (notification.notificationClose === true) {
                    return null;
                }
                return (
                    <StatusCard
                        key={index}
                        onRefresh={refreshPage}
                        title="Application Status Change"
                        statusChanged={`${notification.walkerSurname} has applied your application!`}
                        time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                        notificationId={notification.notificationId}
                        showRedDot={!notification.notificationCheck} // Display red dot if NotificationCheck is false
                        role={role}
                    />
                );
            })}
            {Notifications_Profile && Notifications_Profile.length > 0 && Notifications_Profile.map((notification, index) => {

                if (notification.notificationClose === true) {
                    return null;
                }
                return (
                    <StatusCard_profile
                        key={index}
                        onRefresh={refreshPage}
                        title={notification.notifyType}
                        statusChanged={notification.message}
                        time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                        notificationId={notification.notifyId}
                        showRedDot={!notification.notificationCheck} // Display red dot if NotificationCheck is false
                        role={role}
                    />
                );
            })}
        </div>
            </BackgroundLayout>
    );

}

