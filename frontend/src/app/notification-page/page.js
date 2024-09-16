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

export default function Home() {
    const [statusCards, setStatusCards] = useState([]); // 初始化为空数组

    useEffect(() => {
        const myInit = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
            mode: 'cors',
            cache: 'default'
        };

        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('roles')?.trim().toLowerCase();
        console.log(`Role from storage: ${role}`);

        if (role !== "walker"){
            console.error('Not a walker, no fetch executed');
            return; // 如果不是 walker 角色，直接返回
        }
        console.info("111111")
        const walkerId = parseInt(userId, 10); // 直接将 userId 设置为 walkerId
        console.info("Walker ID set to: " + walkerId);

        const requestURL = `http://127.0.0.1:8080/Notification/findNotificationByWalkerId/${walkerId}`;

        fetch(requestURL, myInit)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 假设 data 是数组
                setStatusCards(data); // 设置整个返回数据为状态卡片
                console.info("userId = "+ userId+"  role = "+role)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // 空依赖数组确保只在组件加载时执行一次

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <Header title="Emma-parent" navigateTo={"/message"}/>
            {/* 保护性检查，只有当statusCards是非空数组时，才渲染 */}
            {statusCards && statusCards.length > 0 && statusCards.map((card, index) => (
                <StatusCard
                    key={index}
                    parentId={card.parentId}
                    walkerId={card.walkerId}
                    status={card.status}
                    time={card.time}
                />
            ))}
        </div>
    );
}