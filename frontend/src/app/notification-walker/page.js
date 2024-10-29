// // // pages/index.js
// // 'use client'
// // import React, {useState} from 'react';
// // import StatusCard from '../../components/StatusCard';
// // import Header from "../../components/Header";
// //
// // export default function Home() {
// //
// //
// //     return (
// //         <div className="flex flex-col h-screen bg-gray-100 p-4">
// //             <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
// //             <StatusCard
// //                 parentId="P123456"
// //                 walkerId="2"
// //                 status="Accepted"
// //                 time="2024-09-12T14:45:00"
// //             />
// //         </div>
// //     );
// // }
// // pages/index.js
// 'use client'
// import React, {useState} from 'react';
// import StatusCard from '../../components/StatusCard';
// import Header from "../../components/Header";
// import {replace} from "react-router-dom";
//
// export default function Home() {
//
//     const [statusCards, setStatusCards] = useState([]);
//
//     const myInit = {
//         method: 'GET',
//         headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
//         mode: 'cors',
//         cache: 'default'
//     };
//     const walkerRequestId = 1;
//     const requestURL = new Request(`http://${apiUrl}/Notification/findNotificationByWalkerRequestId/${walkerRequestId}`, myInit);
//
//     fetch(requestURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             // console.info(response.json())
//             return response.json();
//         })
//         .then(data => {
//                 setStatusCards(data);
//             })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
//
//     // 处理新通知，将其添加到 statusCards 列表
//     const handleNewNotification = (notification) => {
//         const { parentId, walkerId, statusPrevious, statusChanged, time } = notification;
//         const newCard = { parentId, walkerId, statusPrevious, statusChanged, time };
//         setStatusCards(prevCards => [...prevCards, newCard]);
//     };
//
//     return (
//         <div className="flex flex-col h-screen bg-gray-100 p-4">
//             <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
//
//             {/* 使用 NotificationWebSocket 组件来接收 WebSocket 消息 */}
//             {/*<NotificationWebSocket onNewNotification={handleNewNotification} />*/}
//
//             {statusCards && statusCards.length > 0 && statusCards.map((card, index) => (
//                 <StatusCard
//                     key={index}
//                     parentId={card.parentId}
//                     walkerId={card.walkerId}
//                     status={card.status}
//                     time={card.time}
//                 />
//             ))}
//         </div>
//     );
// }
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
    const [statusCards, setStatusCards] = useState([]); // 初始化为空数组
    const [parentSurname, setparentSurname] = useState(0); // 初始化为空数组
    const [walkerRequestId, setwalkerRequestId] = useState(0); // 初始化为空数组
    const [refreshKey, setRefreshKey] = useState(0); // 用于触发重新渲染的状态
    const [Notifications_Profile, setNotifications_Profile] = useState([]);
    const textColor = useTextColor();
    // const token = sessionStorage.getItem('token');
    // if (!role.includes("walker")) {
    //     console.error('Not a walker, no fetch executed');
    //     return; // 如果不是 walker 角色，直接返回
    // }
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
    //const walkerId = parseInt(userId, 10); // 直接将 userId 设置为 walkerId
    console.info("Walker ID set to: " + walkerId);
    console.info("Walker role set to: " + role);
    //根据walkerId获取notification

    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL = `http://${apiUrl}/Notification/findNotificationByWalkerId/${walkerId}`;
        fetch(requestURL, myInit)
            .then(response => {
                if (!response.ok) {throw new Error('Network response was not ok1');}
                return response.json();})
            .then(data => {
                // console.info(data);
                setStatusCards(data);
            })// 设置整个返回数据为状态卡片
            .catch(error => {
                console.error('Error fetching data:', error);});
        },[userId]);

    // useEffect(() => {
    //     // 设置字体颜色基于当前时间
    //     const currentHour = new Date().getHours();
    //     if (currentHour >= 6 && currentHour < 17) {
    //         setTextColor('text-black');  // 上午和下午使用黑色字体
    //     } else {
    //         setTextColor('text-white');  // 晚上和午夜使用白色字体
    //     }
    // }, []);

    //根据walkerId获取walkerRequestId
    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_walkerRequestId = new Request(`http://${apiUrl}/WalkerRequest/getWalkerRequestByWalkerId/${walkerId}`, myInit);
        fetch(requestURL_walkerRequestId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok2');
                }
                return response.json();
            })
            .then(data => {
                // console.info(data);
                // console.info("upupup")
                setwalkerRequestId(data[0].walkerRequestId);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        },[userId]);

    // 获取UPNotifications
    function fetchData_Profile(userId) {
        return fetch(`http://${apiUrl}/UPNotifications/getUPNotificationsByUserId/${userId}`, {
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
                // console.log(`Data received for requestId ${requestId}:`, data);
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

    // 保留fetchAllData_Profile单独执行
    useEffect(() => {
        fetchAllData_Profile(userId);
    }, [userId]); // 确保profile的通知可以独立执行

    //根据walkerRequestId获取parentId
    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_parentId = `http://${apiUrl}/WalkerRequest/getParentIdByWalkerRequestId/${walkerRequestId}`;
        fetch(requestURL_parentId, myInit)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok3');
                }
                return response.json();
            })
            .then(data => {
                // 假设 data 是数组
                // console.info(data);
                // console.info("upupup");
                setparentSurname(data.surname); // 设置整个返回数据为状态卡片
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        },[walkerRequestId]);

    const refreshPage = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };


    // const isoString = ;
    // const date = new Date(isoString);
    //
    // console.log(date.toString());

    return (
        <BackgroundLayout>
            <div className="flex flex-col h-screen p-4" style={{overflowY: 'auto'}}>
                <Header title="Notification-parent" navigateTo={"/home-walker"} textColor={textColor}/>
                {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}

                {statusCards && statusCards.length > 0 && statusCards
                    .filter(card => card && card.statusChanged !== "Applied") // 过滤掉statusChanged为"Applied"的通知
                    .map((card, index) => {
                        if (card && card.notificationClose === true) {
                            return null;
                        }
                        // console.info(parentSurname);
                        // console.info(card.notificationCheck);
                        // console.info("upupup");
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
                    console.info(notification);
                    console.info("refreshPage" + refreshKey);
                    // 如果 notification.NotificationClose 为 true，则不渲染该组件
                    if (notification.notificationClose === true) {
                        return null;
                    }
                    // console.info(notification.notificationClose);
                    // console.info("upupup2");
                    // console.info(notification.notificationCheck);
                    // console.info("upupup3");
                    return (
                        <StatusCard_profile
                            key={index}
                            onRefresh={refreshPage}
                            title={notification.notifyType}
                            statusChanged={notification.message}
                            time={format(notification.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
                            notificationId={notification.notifyId}
                            showRedDot={!notification.notificationCheck} // 如果 NotificationCheck 为 false 则显示红点
                            role={role}
                            // 你可以定义 handleDelete 函数来处理删除逻辑

                        />
                    );
                })}
            </div>
        </BackgroundLayout>
    );
}

