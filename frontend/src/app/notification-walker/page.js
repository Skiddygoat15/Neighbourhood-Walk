'use client'

import React, {useState, useEffect} from 'react';
import StatusCard from '../../components/StatusCard';
import Header from "../../components/Header";
import { format } from 'date-fns';
import StatusCard_profile from "@/components/StatusCard_profile";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [statusCards, setStatusCards] = useState([]);
    const [parentSurname, setparentSurname] = useState(0);
    const [walkerRequestId, setwalkerRequestId] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [Notifications_Profile, setNotifications_Profile] = useState([]);
    const textColor = useTextColor();

    let walkerId = null;
    let userId = null;
    let role = null;
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
        walkerId = sessionStorage.getItem('userId');
        userId = sessionStorage.getItem('userId');
        role = sessionStorage.getItem('currentRole');
        token = sessionStorage.getItem('token');
    }

    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL = `${apiUrl}/Notification/findNotificationByWalkerId/${walkerId}`;
        fetch(requestURL, myInit)
            .then(response => {
                if (!response.ok) {throw new Error('Network response was not ok1');}
                return response.json();})
            .then(data => {
                setStatusCards(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);});
        },[userId]);

    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_walkerRequestId = new Request(`${apiUrl}/WalkerRequest/getWalkerRequestByWalkerId/${walkerId}`, myInit);
        fetch(requestURL_walkerRequestId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok2');
                }
                return response.json();
            })
            .then(data => {
                setwalkerRequestId(data[0].walkerRequestId);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        },[userId]);

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

    function fetchAllData_Profile(userId) {
        fetchData_Profile(userId)
            .then(results => {
                setNotifications_Profile(results);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }

    // Leave fetchAllData_Profile to execute alone
    useEffect(() => {
        fetchAllData_Profile(userId);
    }, [userId]); // Ensure that profile notifications can be executed independently

    // Get parentId based on walkerRequestId
    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_parentId = `${apiUrl}/WalkerRequest/getParentIdByWalkerRequestId/${walkerRequestId}`;
        fetch(requestURL_parentId, myInit)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok3');
                }
                return response.json();
            })
            .then(data => {
                setparentSurname(data.surname); // Set the entire return data as a status card
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        },[walkerRequestId]);

    const refreshPage = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <BackgroundLayout>
            <div className="flex flex-col h-screen p-4" style={{overflowY: 'auto'}}>
                <Header title="Notification-parent" navigateTo={"/home-walker"} textColor={textColor}/>

                {statusCards && statusCards.length > 0 && statusCards
                    .filter(card => card && card.statusChanged !== "Applied") // Filter out notifications with statusChanged as "Applied"
                    .map((card, index) => {
                        if (card && card.notificationClose === true) {
                            return null;
                        }
                        return (
                            <StatusCard
                                key={index}
                                onRefresh={refreshPage}
                                title={"Application Status Change"}
                                statusChanged={parentSurname + " has " + card.statusChanged + " your application!"}
                                time={format(card.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                                notificationId={card.notificationId}
                                showRedDot={!card.notificationCheck}
                                role={role}
                            />
                        )

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
                            showRedDot={!notification.notificationCheck}// If NotificationCheck is false, display the red dot
                            role={role}
                        />
                    );
                })}
            </div>
        </BackgroundLayout>
    );
}

