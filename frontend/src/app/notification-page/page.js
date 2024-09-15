// // pages/index.js
// 'use client'
// import React, {useState} from 'react';
// import StatusCard from '../../components/StatusCard';
// import Header from "../../components/Header";
//
// export default function Home() {
//
//
//     return (
//         <div className="flex flex-col h-screen bg-gray-100 p-4">
//             <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>
//             <StatusCard
//                 parentId="P123456"
//                 walkerId="2"
//                 status="Accepted"
//                 time="2024-09-12T14:45:00"
//             />
//         </div>
//     );
// }
// pages/index.js
'use client'
import React, {useState} from 'react';
import StatusCard from '../../components/StatusCard';
import Header from "../../components/Header";
import NotificationWebSocket from "@/components/NotificationWebSocket";

export default function Home() {

    const [statusCards, setStatusCards] = useState([]);

    // 处理新通知，将其添加到 statusCards 列表
    const handleNewNotification = (notification) => {
        const { parentId, walkerId, statusPrevious, statusChanged, time } = notification;
        const newCard = { parentId, walkerId, statusPrevious, statusChanged, time };
        setStatusCards(prevCards => [...prevCards, newCard]);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <Header title="Emma-parent" navigateTo={"/notification-homepage"}/>

            {/* 使用 NotificationWebSocket 组件来接收 WebSocket 消息 */}
            <NotificationWebSocket onNewNotification={handleNewNotification} />

            {statusCards.map((card, index) => (
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