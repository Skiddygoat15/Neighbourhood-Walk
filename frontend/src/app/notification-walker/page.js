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
//         headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
//         mode: 'cors',
//         cache: 'default'
//     };
//     const walkerRequestId = 1;
//     const requestURL = new Request(`http://127.0.0.1:8080/Notification/findNotificationByWalkerRequestId/${walkerRequestId}`, myInit);
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

export default function Home() {
    const [statusCards, setStatusCards] = useState([]); // 初始化为空数组
    const [parentSurname, setparentSurname] = useState(0); // 初始化为空数组
    const [walkerRequestId, setwalkerRequestId] = useState(0); // 初始化为空数组
    const [refreshKey, setRefreshKey] = useState(0); // 用于触发重新渲染的状态

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('roles');
    // const token = localStorage.getItem('token');
    // if (!role.includes("walker")) {
    //     console.error('Not a walker, no fetch executed');
    //     return; // 如果不是 walker 角色，直接返回
    // }
    const walkerId = parseInt(userId, 10); // 直接将 userId 设置为 walkerId
    console.info("Walker ID set to: " + walkerId);
    console.info("Walker role set to: " + role);
    //根据walkerId获取notification

    useEffect(() => {

        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL = `http://127.0.0.1:8080/Notification/findNotificationByWalkerId/${walkerId}`;
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

    //根据walkerId获取walkerRequestId
    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_walkerRequestId = new Request(`http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${walkerId}`, myInit);
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

    //根据walkerRequestId获取parentId
    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        };
        const requestURL_parentId = `http://127.0.0.1:8080/WalkerRequest/getParentIdByWalkerRequestId/${walkerRequestId}`;
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
        <div className="flex flex-col h-screen bg-gray-100 p-4" style={{ overflowY: 'auto' }}>
            <Header title="Notification-walker" navigateTo={"/message"}/>
            {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}

            {statusCards && statusCards.length > 0 && statusCards
                .filter(card => card.statusChanged !== "Applied") // 过滤掉statusChanged为"Applied"的通知
                .map((card, index) => {
                    if (card.notificationClose === true) {
                        return null;
                    }
                    // console.info(parentSurname);
                    // console.info(card.notificationCheck);
                    // console.info("upupup");
                    return(
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
        </div>
    );
    原来页面
    // return (
    //     <div className="flex flex-col h-screen bg-gray-100 p-4" style={{ overflowY: 'auto' }}>
    //         <Header title="Notification" navigateTo={"/message"}/>
    //         {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}
    //
    //         {statusCards && statusCards.length > 0 && statusCards.map((card, index) => (
    //             <StatusCard
    //                 key={index}
    //                 parentId={parentId}
    //                 walkerId={walkerId}
    //                 statusPrevious={card.statusPrevious}
    //                 statusChanged={card.statusChanged}
    //                 time={format(card.time, 'EEEE, MMMM do, yyyy, hh:mm:ss a')}
    //             />
    //         ))}
    //     </div>
    // );
    测试页面
    // {statusCards && statusCards.length > 0 && statusCards.map((card, index) => {
    //     // 直接在 map 回调中执行 console.log
    //     console.log(new Date(card.time));
    //     return (
    //         <StatusCard
    //             key={index}
    //             parentId={parentId}
    //             walkerId={walkerId}
    //             statusPrevious={card.statusPrevious}
    //             statusChanged={card.statusChanged}
    //             time={card.time}
    //         />
    //     );
    // })}
}

